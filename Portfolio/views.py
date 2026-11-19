from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST

from .forms import ContactForm, RegisterForm


def index(request):
    return render(request, "Portfolio/index.html")


def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(
                request,
                "Thank you! Your message has been sent successfully."
            )
        else:
            messages.error(
                request,
                "Please correct the form errors and try again."
            )

    return redirect("Portfolio:index")


def login_view(request):
    if request.user.is_authenticated:
        return redirect("Portfolio:index")

    form = AuthenticationForm(request, data=request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Welcome back, {user.username}!")
            return redirect("Portfolio:index")

        messages.error(request, "Invalid username or password.")

    return render(request, "Portfolio/login.html", {"form": form})


def register_view(request):
    if request.user.is_authenticated:
        return redirect("Portfolio:index")

    form = RegisterForm(request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Your account has been created.")
            return redirect("Portfolio:index")

        messages.error(request, "Please correct the errors below.")

    return render(request, "Portfolio/register.html", {"form": form})


@require_POST
def logout_view(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect("Portfolio:index")