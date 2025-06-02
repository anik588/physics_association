# views.py (Refactored and Extended)

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
import json
from .models import Blog, Notes, NotesFolder, ResearchPaper, Video, Event

User = get_user_model()

# ======================== Auth ========================

@csrf_exempt
def login_view(request):
<<<<<<< HEAD
    data = json.loads(request.body)
    user = authenticate(request, username=data['username'], password=data['password'])
    if user and user.is_approved:
        login(request, user)
        return JsonResponse({"message": "Logged in"})
    return JsonResponse({"error": "Invalid credentials or not approved"}, status=401)
=======
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({"message": "Logged in successfully"})
        return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Method not allowed"}, status=405)


>>>>>>> 36b8bace (Initial commit)

@csrf_exempt
def register_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'STUDENT').upper()

        if role == 'ADMIN':
            return JsonResponse({'error': 'Cannot register as admin'}, status=403)

        if not all([username, email, password]):
            return JsonResponse({'error': 'All fields required'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'User already exists'}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            roll=data.get('roll'),
            gender=data.get('gender'),
            session=data.get('session'),
            position=data.get('position'),
            university=data.get('university'),
            education_details=data.get('education_details'),
            bio=data.get('bio'),
        )

        return JsonResponse({'message': f'{role} account created successfully'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})

@login_required
def login_check(request):
<<<<<<< HEAD
    return JsonResponse({
        "username": request.user.username,
        "email": request.user.email,
        "role": request.user.role,
    })
=======
    try:
        data = {
            "username": request.user.username,
            "activity": "Recent activity data"
        }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
>>>>>>> 36b8bace (Initial commit)

def user_profile(request, username):
    user = get_object_or_404(User, username=username, is_approved=True)
    
    # Determine if the requesting user is viewing their own profile
    is_owner = request.user == user
    # Basic public info
    data = {
        'username': user.username,
        'role': user.role,
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'bio': user.bio or '',
        'is_owner': is_owner,  # <--- important
        'counts': {
            'blogs': Blog.objects.filter(author=user, is_verified=True).count(),
            'notes': Notes.objects.filter(author=user, is_verified=True).count(),
            'papers': ResearchPaper.objects.filter(author=user, is_verified=True).count(),
            'videos': Video.objects.filter(uploaded_by=user, is_verified=True).count(),
            'events': Event.objects.filter(created_by=user).count() if user.is_moderator else 0,
        },
        # Optionally, send last 3 verified blogs titles/ids
        'recent_blogs': list(Blog.objects.filter(author=user, is_verified=True).order_by('-created_at')[:3].values('id', 'title')),
    }

    return JsonResponse(data)

@csrf_exempt
@login_required
def account_edit(request):
    if request.method == 'POST':
        try:
            # Update user details (email, bio, profile picture)
            user = request.user
            data = json.loads(request.body)

            # Only allow updating these fields
            if 'email' in data:
                user.email = data['email']

            if 'bio' in data:
                user.bio = data['bio']

            if 'profile_picture' in data:
                # Ensure the profile picture is handled properly (e.g., uploading it to the correct folder)
                user.profile_picture = data['profile_picture']  # Assuming it's a base64 encoded file or URL

            # Save the changes
            user.save()

            return JsonResponse({'message': 'Account updated successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)

# views.py
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

User = get_user_model()

@csrf_exempt
def send_reset_link(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:3000/reset_password?uid={uid}&token={token}"
            send_mail(
                "Reset Your Password",
                f"Click the link to reset your password: {reset_link}",
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return JsonResponse({'success': True})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)


def reset_password_view(request):
    uidb64 = request.GET.get('uid')
    token = request.GET.get('token')
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        return HttpResponse("Invalid link", status=400)

    if default_token_generator.check_token(user, token):
        return render(request, 'reset_password_form.html', {
            'uid': uidb64,
            'token': token
        })
    else:
        return HttpResponse("Invalid or expired link", status=400)


@csrf_exempt
def update_password(request):
    if request.method == 'POST':
        uidb64 = request.POST.get('uid')
        token = request.POST.get('token')
        new_password = request.POST.get('new_password')
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return HttpResponse("Invalid user", status=400)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return HttpResponse("Password reset successful", status=200)
        else:
            return HttpResponse("Invalid or expired token", status=400)

    return HttpResponse("Invalid request", status=400)

# ======================== Generic Views ========================

def public_list_view(request, model):
    model_map = {
        'blogs': Blog,
        'notes': Notes,
        'papers': ResearchPaper,
        'videos': Video,
        'events': Event,
    }
    M = model_map.get(model)
    if not M:
        return JsonResponse({'error': 'Invalid model'}, status=400)

    if model == 'events':
        objects = M.objects.order_by('-event_date')[:10]
    else:
        objects = M.objects.filter(is_verified=True).order_by('-created_at')[:10]

    return JsonResponse(list(objects.values()), safe=False)

def public_detail_view(request, model, id):
    model_map = {
        'blog': Blog,
        'notes': Notes,
        'paper': ResearchPaper,
        'video': Video,
        'event': Event,
    }
    M = model_map.get(model)
    if not M:
        return JsonResponse({'error': 'Invalid model'}, status=400)

    obj = get_object_or_404(M, id=id)
    if hasattr(obj, 'is_verified') and not obj.is_verified:
        return JsonResponse({'error': 'Not verified'}, status=403)

    if hasattr(obj, 'views'):
        obj.views += 1
        obj.save()

    return JsonResponse({field.name: getattr(obj, field.name) for field in obj._meta.fields})

@csrf_exempt
@login_required
def create_content_view(request, model):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    model_map = {
        'blog': Blog,
        'notes': Notes,
        'paper': ResearchPaper,
        'video': Video,
        'event': Event,
    }
    M = model_map.get(model)
    if not M:
        return JsonResponse({'error': 'Invalid model'}, status=400)

    try:
        data = request.POST.dict()
        file = request.FILES.get('file')

        # Basic content fields
        if model == 'blog':
            obj = M.objects.create(title=data['title'], content=data['content'], author=request.user)
        elif model == 'notes':
            folder = NotesFolder.objects.get(id=data['folder_id'])
            obj = M.objects.create(folder=folder, title=data['title'], file=file, author=request.user)
        elif model == 'paper':
            obj = M.objects.create(title=data['title'], abstract=data['abstract'], document=file, author=request.user)
        elif model == 'video':
            obj = M.objects.create(title=data['title'], youtube_url=data['youtube_url'], uploaded_by=request.user)
        elif model == 'event' and request.user.is_moderator:
            obj = M.objects.create(title=data['title'], description=data['description'], event_date=data['event_date'], created_by=request.user)
        else:
            return JsonResponse({'error': 'Not allowed'}, status=403)

        return JsonResponse({'id': obj.id, 'status': 'created'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@login_required
def rud_content_view(request, model, id):
    model_map = {
        'blog': Blog,
        'notes': Notes,
        'paper': ResearchPaper,
        'video': Video,
        'event': Event,
    }
    M = model_map.get(model)
    if not M:
        return JsonResponse({'error': 'Invalid model'}, status=400)

    obj = get_object_or_404(M, id=id)
    if hasattr(obj, 'author') and obj.author != request.user:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    if hasattr(obj, 'uploaded_by') and obj.uploaded_by != request.user:
        return JsonResponse({'error': 'Permission denied'}, status=403)
    if hasattr(obj, 'created_by') and obj.created_by != request.user:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    if request.method == 'DELETE':
        obj.delete()
        return JsonResponse({'status': 'deleted'})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            for field in data:
                setattr(obj, field, data[field])
            obj.save()
            return JsonResponse({'status': 'updated'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST or DELETE allowed'}, status=405)

# ======================== Teacher Verification ========================

@login_required
def teacher_pending(request):
    if request.user.role != 'TEACHER':
        return JsonResponse({'error': 'Not allowed'}, status=403)

    return JsonResponse({
        'blogs': list(Blog.objects.filter(is_verified=False).values('id', 'title')),
        'notes': list(Notes.objects.filter(is_verified=False).values('id', 'title')),
        'papers': list(ResearchPaper.objects.filter(is_verified=False).values('id', 'title')),
    })

@csrf_exempt
@login_required
@require_POST
def approve_content(request, model, id):
    model_map = {
        'blog': Blog,
        'notes': Notes,
        'paper': ResearchPaper,
        'video': Video,
        'event': Event,
    }

    M = model_map.get(model)
    if not M:
        return JsonResponse({'error': 'Invalid model'}, status=400)

    try:
        obj = M.objects.get(id=id)
        obj.is_verified = True
        obj.verified_by_teacher = True
        obj.verified_by = request.user
        obj.save()
        return JsonResponse({'status': 'approved'})
    except M.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    

@login_required
def my_uploads(request):
    user = request.user
    data = {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "is_approved": user.is_approved,
        "blogs": list(Blog.objects.filter(author=user).order_by('-created_at').values()),
        "notes": list(Notes.objects.filter(author=user).order_by('-created_at').values()),
        "papers": list(ResearchPaper.objects.filter(author=user).order_by('-created_at').values()),
        "videos": list(Video.objects.filter(uploaded_by=user).order_by('-created_at').values()),
    }
    if user.is_moderator:
        data["events"] = list(Event.objects.filter(created_by=user).order_by('-created_at').values())
    return JsonResponse(data)
