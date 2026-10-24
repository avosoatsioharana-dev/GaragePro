from rest_framework import serializers
from .models import (Client, Marque, Modele, Vehicule, Poste, Employe, TypeIntervention,
                     RendezVous, Intervention, Piece, InterventionPiece, MouvementStock,
                     Facture, LigneFacture, Paiement)

class ClientSerializer(serializers.ModelSerializer):
    class Meta: model = Client; fields = '__all__'
class MarqueSerializer(serializers.ModelSerializer):
    class Meta: model = Marque; fields = '__all__'
class ModeleSerializer(serializers.ModelSerializer):
    class Meta: model = Modele; fields = '__all__'
class VehiculeSerializer(serializers.ModelSerializer):
    class Meta: model = Vehicule; fields = '__all__'
class PosteSerializer(serializers.ModelSerializer):
    class Meta: model = Poste; fields = '__all__'
class EmployeSerializer(serializers.ModelSerializer):
    class Meta: model = Employe; fields = '__all__'
class TypeInterventionSerializer(serializers.ModelSerializer):
    class Meta: model = TypeIntervention; fields = '__all__'
class RendezVousSerializer(serializers.ModelSerializer):
    class Meta: model = RendezVous; fields = '__all__'
class InterventionSerializer(serializers.ModelSerializer):
    class Meta: model = Intervention; fields = '__all__'
class PieceSerializer(serializers.ModelSerializer):
    class Meta: model = Piece; fields = '__all__'
class InterventionPieceSerializer(serializers.ModelSerializer):
    class Meta: model = InterventionPiece; fields = '__all__'
class MouvementStockSerializer(serializers.ModelSerializer):
    class Meta: model = MouvementStock; fields = '__all__'
class FactureSerializer(serializers.ModelSerializer):
    class Meta: model = Facture; fields = '__all__'
class LigneFactureSerializer(serializers.ModelSerializer):
    class Meta: model = LigneFacture; fields = '__all__'
class PaiementSerializer(serializers.ModelSerializer):
    class Meta: model = Paiement; fields = '__all__'
