from rest_framework import viewsets, status
from rest_framework.decorators import action

from django.db.models import Sum

from rest_framework.response import Response
from django.db import transaction
from django.db import models 

from .models import Product, Inventory, Dealer, Order, OrderItem
from .serializers import (
    ProductSerializer,
    DealerSerializer,
    OrderSerializer,
    InventorySerializer,
)
from core import models


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class DealerViewSet(viewsets.ModelViewSet):
    queryset = Dealer.objects.prefetch_related("orders__items__product").all()

    serializer_class = DealerSerializer


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

    @action(detail=True, methods=["put"])
    def adjust(self, request, pk=None):
        inventory = self.get_object()

        quantity = request.data.get("quantity")

        if quantity is None:
            return Response(
                {"error": "Quantity is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
        except ValueError:
            return Response(
                {"error": "Quantity must be a number"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 0:
            return Response(
                {"error": "Quantity cannot be negative"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        inventory.quantity = quantity
        inventory.save()

        return Response({
            "message": "Inventory updated successfully",
            "product": inventory.product.name,
            "new_quantity": inventory.quantity
        })


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items").all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        status_param = self.request.query_params.get("status")
        dealer_param = self.request.query_params.get("dealer")
        date_param = self.request.query_params.get("date")
        ordering = self.request.query_params.get("ordering")

        if status_param:
            queryset = queryset.filter(status=status_param)

        if dealer_param:
            queryset = queryset.filter(dealer_id=dealer_param)

        if date_param:
            queryset = queryset.filter(created_at__date=date_param)
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset
    def destroy(self, request, *args, **kwargs):
        order = self.get_object()

    # Delivered order delete not allowed -> error response
        if order.status == "Delivered":
            return Response(
                {"error": "Delivered orders cannot be deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Confirmed order delete → stock restore
        if order.status == "Confirmed":
            with transaction.atomic():
                for item in order.items.all():
                    inventory = Inventory.objects.get(product=item.product)
                    inventory.quantity += item.quantity
                    inventory.save()

                order.delete()

            return Response({"message": "Order deleted and stock restored."})

    # Draft order delete → simple delete
        order.delete()
        return Response({"message": "Draft order deleted."})
    @action(detail=False, methods=["get"])
    def report(self, request):
        total_orders = Order.objects.count()
        draft_orders = Order.objects.filter(status="Draft").count()
        confirmed_orders = Order.objects.filter(status="Confirmed").count()
        delivered_orders = Order.objects.filter(status="Delivered").count()

        total_revenue = Order.objects.filter(
            status__in=["Confirmed", "Delivered"]
        ).aggregate(total=Sum("total_amount"))["total"] or 0

        return Response({
            "total_orders": total_orders,
            "draft_orders": draft_orders,
            "confirmed_orders": confirmed_orders,
        "delivered_orders": delivered_orders,
            "total_revenue": total_revenue,
        })
        
    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        order = self.get_object()

        if order.status != "Draft":
            return Response(
                {"error": "Only draft orders can be confirmed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            for item in order.items.all():
                inventory = Inventory.objects.get(product=item.product)

                if item.quantity > inventory.quantity:
                    return Response(
                        {
                            "error": f"Insufficient stock for {item.product.name}. Available: {inventory.quantity},     Requested: {item.quantity}"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            for item in order.items.all():
                inventory = Inventory.objects.get(product=item.product)
                inventory.quantity -= item.quantity
                inventory.save()

            order.status = "Confirmed"
            order.save()

        return Response({"message": "Order confirmed successfully"})




    @action(detail=True, methods=["post"])
    def deliver(self, request, pk=None):
        order = self.get_object()

        if order.status != "Confirmed":
            return Response(
                {"error": "Only confirmed orders can be delivered"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "Delivered"
        order.save()

        return Response({"message": "Order delivered successfully"})

