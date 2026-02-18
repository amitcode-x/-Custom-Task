from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, DealerViewSet, OrderViewSet, InventoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'dealers', DealerViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'inventory', InventoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
