from rest_framework import viewsets
from .models import (Client, Marque, Modele, Vehicule, Poste, Employe, TypeIntervention,
                     RendezVous, Intervention, Piece, InterventionPiece, MouvementStock,
                     Facture, LigneFacture, Paiement)
from .serializers import (ClientSerializer, MarqueSerializer, ModeleSerializer, VehiculeSerializer,
                          PosteSerializer, EmployeSerializer, TypeInterventionSerializer,
                          RendezVousSerializer, InterventionSerializer, PieceSerializer,
                          InterventionPieceSerializer, MouvementStockSerializer, FactureSerializer,
                          LigneFactureSerializer, PaiementSerializer)

class ClientViewSet(viewsets.ModelViewSet): queryset = Client.objects.all(); serializer_class = ClientSerializer
class MarqueViewSet(viewsets.ModelViewSet): queryset = Marque.objects.all(); serializer_class = MarqueSerializer
class ModeleViewSet(viewsets.ModelViewSet): queryset = Modele.objects.select_related('marque').all(); serializer_class = ModeleSerializer
class VehiculeViewSet(viewsets.ModelViewSet): queryset = Vehicule.objects.select_related('client', 'modele').all(); serializer_class = VehiculeSerializer
class PosteViewSet(viewsets.ModelViewSet): queryset = Poste.objects.all(); serializer_class = PosteSerializer
class EmployeViewSet(viewsets.ModelViewSet): queryset = Employe.objects.select_related('poste').all(); serializer_class = EmployeSerializer
class TypeInterventionViewSet(viewsets.ModelViewSet): queryset = TypeIntervention.objects.all(); serializer_class = TypeInterventionSerializer
class RendezVousViewSet(viewsets.ModelViewSet): queryset = RendezVous.objects.select_related('client', 'vehicule').all(); serializer_class = RendezVousSerializer
class InterventionViewSet(viewsets.ModelViewSet): queryset = Intervention.objects.select_related('rendez_vous', 'employe', 'type_intervention', 'vehicule').all(); serializer_class = InterventionSerializer
class PieceViewSet(viewsets.ModelViewSet): queryset = Piece.objects.all(); serializer_class = PieceSerializer
class InterventionPieceViewSet(viewsets.ModelViewSet): queryset = InterventionPiece.objects.select_related('intervention', 'piece').all(); serializer_class = InterventionPieceSerializer
class MouvementStockViewSet(viewsets.ModelViewSet): queryset = MouvementStock.objects.select_related('piece', 'employe').all(); serializer_class = MouvementStockSerializer
class FactureViewSet(viewsets.ModelViewSet): queryset = Facture.objects.select_related('intervention').all(); serializer_class = FactureSerializer
class LigneFactureViewSet(viewsets.ModelViewSet): queryset = LigneFacture.objects.select_related('facture').all(); serializer_class = LigneFactureSerializer
class PaiementViewSet(viewsets.ModelViewSet): queryset = Paiement.objects.select_related('facture').all(); serializer_class = PaiementSerializer
