from rest_framework import serializers
from .models import Product, Inventory, Dealer, Order, OrderItem


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    inventory = InventorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"





class DealerOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "unit_price", "line_total"]


class DealerOrderSerializer(serializers.ModelSerializer):
    items = DealerOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "total_amount",
            "created_at",
            "items",
        ]
class DealerSerializer(serializers.ModelSerializer):
    orders = DealerOrderSerializer(many=True, read_only=True)

    class Meta:
        model = Dealer
        fields = "__all__"



class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "unit_price", "line_total"]
        read_only_fields = ["unit_price", "line_total"]



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "dealer",
            "order_number",
            "status",
            "total_amount",
            "created_at",
            "items",
        ]
        read_only_fields = ["order_number", "total_amount", "status"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)

        total_amount = 0

        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]

            unit_price = product.price
            line_total = unit_price * quantity
            total_amount += line_total

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                line_total=line_total,
            )

        order.total_amount = total_amount
        order.save()

        return order


    # YAHI DALNA HAI (create ke niche)
    def update(self, instance, validated_data):
        if instance.status != "Draft":
            raise serializers.ValidationError(
                "Only draft orders can be edited."
            )

        items_data = validated_data.pop("items", None)

        if items_data:
            instance.items.all().delete()

            total_amount = 0

            for item_data in items_data:
                product = item_data["product"]
                quantity = item_data["quantity"]

                unit_price = product.price
                line_total = unit_price * quantity
                total_amount += line_total

                OrderItem.objects.create(
                    order=instance,
                    product=product,
                    quantity=quantity,
                    unit_price=unit_price,
                    line_total=line_total,
                )

            instance.total_amount = total_amount

        instance.save()
        return instance
