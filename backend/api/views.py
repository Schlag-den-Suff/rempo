from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def health_check(request):
    """
    Simple health check endpoint to verify the API is running.
    """
    return Response({
        'status': 'healthy',
        'message': 'Backend API is running'
    })


@api_view(['GET'])
def api_info(request):
    """
    API information endpoint.
    """
    return Response({
        'name': 'Rempo API',
        'version': '1.0.0',
        'description': 'Django REST API for Rempo application'
    })

