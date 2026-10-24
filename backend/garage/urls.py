from rest_framework.routers import DefaultRouter
from . import views
router = DefaultRouter()
router.register('clients', views.ClientViewSet, basename='client')
router.register('marques', views.MarqueViewSet, basename='marque')
router.register('modeles', views.ModeleViewSet, basename='modele')
router.register('vehicules', views.VehiculeViewSet, basename='vehicule')
router.register('postes', views.PosteViewSet, basename='poste')
router.register('employes', views.EmployeViewSet, basename='employe')
router.register('types-intervention', views.TypeInterventionViewSet, basename='typeintervention')
router.register('rendez-vous', views.RendezVousViewSet, basename='rendezvous')
router.register('interventions', views.InterventionViewSet, basename='intervention')
router.register('pieces', views.PieceViewSet, basename='piece')
router.register('intervention-pieces', views.InterventionPieceViewSet, basename='interventionpiece')
router.register('mouvements-stock', views.MouvementStockViewSet, basename='mouvementstock')
router.register('factures', views.FactureViewSet, basename='facture')
router.register('lignes-facture', views.LigneFactureViewSet, basename='lignefacture')
router.register('paiements', views.PaiementViewSet, basename='paiement')
urlpatterns = router.urls
