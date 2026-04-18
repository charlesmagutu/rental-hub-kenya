from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('LANDLORD', 'Landlord'),
        ('TENANT', 'Tenant'),
        ('STAFF', 'Staff'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='LANDLORD')
    phone = models.CharField(max_length=15, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)

class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    notice_period_days = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)

class Unit(models.Model):
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('OCCUPIED', 'Occupied'),
        ('RESERVED', 'Reserved'),
        ('MAINTENANCE', 'Maintenance'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='units')
    unit_number = models.CharField(max_length=50)
    unit_type = models.CharField(max_length=100)
    rent_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    layout_image = models.URLField(blank=True, null=True)
    features = models.JSONField(default=list)

class Tenant(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('NOTICE', 'On Notice'),
        ('MOVED_OUT', 'Moved Out'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tenant_profile')
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, related_name='tenants')
    id_number = models.CharField(max_length=50)
    lease_start = models.DateField()
    lease_end = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    is_active = models.BooleanField(default=True)

class Payment(models.Model):
    PAYMENT_METHOD = (
        ('MPESA', 'M-Pesa'),
        ('STRIPE', 'Stripe'),
        ('BANK', 'Bank'),
        ('CASH', 'Cash'),
    )
    PAYMENT_TYPE = (
        ('RENT', 'Rent'),
        ('UTILITY', 'Utility'),
        ('DEPOSIT', 'Deposit'),
    )
    STATUS = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='payments')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=20, choices=PAYMENT_METHOD)
    type = models.CharField(max_length=20, choices=PAYMENT_TYPE)
    reference = models.CharField(max_length=100, unique=True)
    mpesa_receipt_number = models.CharField(max_length=50, blank=True, null=True)
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS, default='PENDING')
    date = models.DateTimeField(auto_now_add=True)

class Receipt(models.Model):
    receipt_number = models.CharField(max_length=50, unique=True)
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE)
    pdf_url = models.URLField(blank=True)
    verification_code = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UtilityBill(models.Model):
    TYPE = (('WATER', 'Water'), ('ELECTRICITY', 'Electricity'), ('SERVICE', 'Service Charge'))
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    bill_type = models.CharField(max_length=20, choices=TYPE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    billing_period = models.DateField()
    is_paid = models.BooleanField(default=False)

class SecurityDeposit(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_refunded = models.BooleanField(default=False)
    refund_date = models.DateField(null=True, blank=True)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deduction_reason = models.TextField(blank=True)

class Notice(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    notice_date = models.DateField()
    move_out_date = models.DateField()
    reason = models.TextField()
    is_approved = models.BooleanField(default=False)

class Booking(models.Model):
    STATUS_CHOICES = (('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected'))
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    applicant_phone = models.CharField(max_length=20)
    move_in_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

class Expense(models.Model):
    CATEGORY = (('MAINTENANCE', 'Maintenance'), ('UTILITY', 'Utility'), ('TAX', 'Tax'), ('SALARY', 'Salary'), ('OTHER', 'Other'))
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    date = models.DateField()
    receipt_url = models.URLField(blank=True)

class Notification(models.Model):
    TYPE = (('SMS', 'SMS'), ('EMAIL', 'Email'), ('WHATSAPP', 'WhatsApp'), ('SYSTEM', 'System'))
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    message = models.TextField()
    channel = models.CharField(max_length=20, choices=TYPE)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)