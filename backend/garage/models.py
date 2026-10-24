from django.db import models

class Client(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=10)
    email = models.EmailField(max_length=150, unique=True, null=True, blank=True)
    adresse = models.CharField(max_length=255, blank=True)
    date_inscription = models.DateField(auto_now_add=True)
    def __str__(self): return f'{self.prenom} {self.nom}'
    class Meta: ordering = ['nom', 'prenom']

class Marque(models.Model):
    nom_marque = models.CharField(max_length=100, unique=True)
    pays_origine = models.CharField(max_length=100, blank=True)
    def __str__(self): return self.nom_marque

class Modele(models.Model):
    nom_modele = models.CharField(max_length=100)
    annee_debut = models.PositiveSmallIntegerField(null=True, blank=True)
    annee_fin = models.PositiveSmallIntegerField(null=True, blank=True)
    marque = models.ForeignKey(Marque, on_delete=models.PROTECT, related_name='modeles')
    def __str__(self): return f'{self.marque} {self.nom_modele}'

class Vehicule(models.Model):
    immatriculation = models.CharField(max_length=7, unique=True)
    numero_chassis = models.CharField(max_length=17, unique=True, null=True, blank=True)
    annee_fabrication = models.PositiveSmallIntegerField(null=True, blank=True)
    couleur = models.CharField(max_length=50, blank=True)
    carburant = models.CharField(max_length=30, blank=True)
    kilometrage = models.PositiveIntegerField(default=0)
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='vehicules')
    modele = models.ForeignKey(Modele, on_delete=models.PROTECT, related_name='vehicules')
    def __str__(self): return f'{self.immatriculation} — {self.modele}'

class Poste(models.Model):
    intitule = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    def __str__(self): return self.intitule

class Employe(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=10, blank=True)
    email = models.EmailField(max_length=150, unique=True)
    date_embauche = models.DateField()
    salaire = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    poste = models.ForeignKey(Poste, on_delete=models.PROTECT, related_name='employes')
    def __str__(self): return f'{self.prenom} {self.nom}'

class TypeIntervention(models.Model):
    libelle = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    tarif_standard = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    def __str__(self): return self.libelle

class RendezVous(models.Model):
    date_heure = models.DateTimeField()
    motif = models.TextField(blank=True)
    statut = models.CharField(max_length=30, default='planifie')
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='rendez_vous')
    vehicule = models.ForeignKey(Vehicule, on_delete=models.PROTECT, related_name='rendez_vous')
    def __str__(self): return f'RDV #{self.pk} — {self.date_heure:%d/%m/%Y %H:%M}'

class Intervention(models.Model):
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True)
    diagnostic = models.TextField(blank=True)
    cout_main_oeuvre = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    statut = models.CharField(max_length=30, default='en_cours')
    rendez_vous = models.ForeignKey(RendezVous, on_delete=models.SET_NULL, null=True, blank=True, related_name='interventions')
    employe = models.ForeignKey(Employe, on_delete=models.PROTECT, related_name='interventions')
    type_intervention = models.ForeignKey(TypeIntervention, on_delete=models.PROTECT, related_name='interventions')
    vehicule = models.ForeignKey(Vehicule, on_delete=models.PROTECT, related_name='interventions')
    def __str__(self): return f'Intervention #{self.pk} — {self.vehicule}'

class Piece(models.Model):
    reference = models.CharField(max_length=5, unique=True)
    nom_piece = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    prix_achat = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    prix_vente = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    quantite_stock = models.PositiveIntegerField(default=0)
    seuil_alerte = models.PositiveIntegerField(default=5)
    def __str__(self): return f'{self.reference} — {self.nom_piece}'

class InterventionPiece(models.Model):
    intervention = models.ForeignKey(Intervention, on_delete=models.CASCADE, related_name='pieces_utilisees')
    piece = models.ForeignKey(Piece, on_delete=models.PROTECT, related_name='utilisations')
    quantite = models.PositiveIntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=2)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['intervention', 'piece'], name='unique_piece_par_intervention')]
    def __str__(self): return f'{self.piece} x {self.quantite}'

class MouvementStock(models.Model):
    type_mouvement = models.CharField(max_length=20)
    quantite = models.PositiveIntegerField()
    date_mouvement = models.DateTimeField(auto_now_add=True)
    motif = models.CharField(max_length=255, blank=True)
    piece = models.ForeignKey(Piece, on_delete=models.PROTECT, related_name='mouvements')
    employe = models.ForeignKey(Employe, on_delete=models.PROTECT, related_name='mouvements_stock')
    def __str__(self): return f'{self.type_mouvement} {self.piece} ({self.quantite})'

class Facture(models.Model):
    numero_facture = models.CharField(max_length=4, unique=True)
    date_facture = models.DateField()
    date_echeance = models.DateField(null=True, blank=True)
    montant_ht = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    taux_tva = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    montant_tva = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    montant_ttc = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    statut = models.CharField(max_length=30, default='brouillon')
    intervention = models.ForeignKey(Intervention, on_delete=models.PROTECT, related_name='factures')
    def __str__(self): return self.numero_facture

class LigneFacture(models.Model):
    designation = models.CharField(max_length=255)
    quantite = models.PositiveIntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=2)
    montant_ligne = models.DecimalField(max_digits=12, decimal_places=2)
    facture = models.ForeignKey(Facture, on_delete=models.CASCADE, related_name='lignes')
    def __str__(self): return self.designation

class Paiement(models.Model):
    date_paiement = models.DateTimeField()
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    mode_paiement = models.CharField(max_length=30)
    reference_paiement = models.CharField(max_length=100, null=True, blank=True)
    statut = models.CharField(max_length=30, default='en_attente')
    facture = models.ForeignKey(Facture, on_delete=models.PROTECT, related_name='paiements')
    def __str__(self): return f'Paiement #{self.pk} — {self.montant}'
