from django.contrib import admin
from .models import (Client, Marque, Modele, Vehicule, Poste, Employe, TypeIntervention,
                     RendezVous, Intervention, Piece, InterventionPiece, MouvementStock,
                     Facture, LigneFacture, Paiement)
admin.site.register([Client, Marque, Modele, Vehicule, Poste, Employe, TypeIntervention,
                     RendezVous, Intervention, Piece, InterventionPiece, MouvementStock,
                     Facture, LigneFacture, Paiement])
