class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            order = serializer.save()
            return Response({"message": "Đặt hàng thành công", "order_id": order.id}, status=201)
        return Response(serializer.errors, status=400)
