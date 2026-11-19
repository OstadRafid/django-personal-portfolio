from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message"]

        widgets = {
            "name": forms.TextInput(attrs={
                "placeholder": "Enter your name"
            }),
            "email": forms.EmailInput(attrs={
                "placeholder": "Enter your email"
            }),
            "subject": forms.TextInput(attrs={
                "placeholder": "Enter subject"
            }),
            "message": forms.Textarea(attrs={
                "placeholder": "Write your message",
                "rows": 5
            }),
        }


class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password1", "password2"]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]

        if commit:
            user.save()

        return user