from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Blog, Notes, NotesFolder, ResearchPaper, Video, Event

@csrf_exempt
def login_view(request):
    data = json.loads(request.body)
    user = authenticate(request, username=data['username'], password=data['password'])
    if user:
        login(request, user)
        return JsonResponse({"message": "Logged in"})
    return JsonResponse({"error": "Invalid credentials"}, status=401)


from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import json

User = get_user_model()

@csrf_exempt
def register_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'STUDENT').upper()  # default to STUDENT

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
        )


        return JsonResponse({'message': f'{role} account created successfully'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def login_check(request):
    return JsonResponse({
        "username": request.user.username,
        "email": request.user.email,
        "role": request.user.role,
    })
    

def public_user_profile(request, username):
    user = get_object_or_404(User, username=username)

    data = {
        "username": user.username,
        "email": user.email if request.user == user else None,
        "role": user.role,
        "is_owner": request.user == user,
        "blogs": list(Blog.objects.filter(author=user).order_by('-created_at').values()),
        "notes": list(Notes.objects.filter(author=user).order_by('-created_at').values()),
        "papers": list(ResearchPaper.objects.filter(author=user).order_by('-created_at').values()),
        "videos": list(Video.objects.filter(uploaded_by=user).order_by('-created_at').values()),
    }

    if user.is_moderator:
        data["events"] = list(Event.objects.filter(created_by=user).order_by('-created_at').values())

    return JsonResponse(data)

    
from django.contrib.auth import logout

@csrf_exempt
def logout_view(request):
    logout(request)  # ✅ Clears session
    return JsonResponse({"message": "Logged out"})    


def public_latest(request):
    return JsonResponse({
        'blogs': list(Blog.objects.filter(is_verified=True).order_by('-created_at')[:10].values()),
        'notes': list(Notes.objects.filter(is_verified=True).order_by('-created_at')[:10].values()),
        'papers': list(ResearchPaper.objects.filter(is_verified=True).order_by('-created_at')[:10].values()),
        'videos': list(Video.objects.filter(is_verified=True).order_by('-created_at')[:10].values()),
        'events': list(Event.objects.order_by('-event_date')[:10].values()),
    }, safe=False)
    
    
from django.shortcuts import get_object_or_404

def blog_detail(request, id):
    blog = get_object_or_404(Blog, id=id, is_verified=True)
    blog.views += 1
    blog.save()
    return JsonResponse({
        'id': blog.id,
        'title': blog.title,
        'content': blog.content,
        'author': blog.author.username,
        'verified_by': blog.verified_by.username if blog.verified_by else None,
        'views': blog.views,
    })    


from django.contrib.auth.decorators import login_required

@login_required
def teacher_pending(request):
    if request.user.role != 'TEACHER':
        return JsonResponse({'error': 'Not allowed'}, status=403)

    return JsonResponse({
        'blogs': list(Blog.objects.filter(is_verified=False).values('id', 'title')),
        'notes': list(Notes.objects.filter(is_verified=False).values('id', 'title')),
        'papers': list(ResearchPaper.objects.filter(is_verified=False).values('id', 'title')),
    })
    

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

@csrf_exempt
@login_required
@require_POST
def approve_content(request, model, id):
    if request.user.role != 'TEACHER':
        return JsonResponse({'error': 'Only teachers can approve'}, status=403)

    model_map = {
        'blog': Blog,
        'notes': Notes,
        'paper': ResearchPaper,
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
    
    
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Blog, Notes, ResearchPaper, Video, Event

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


@csrf_exempt
@login_required
def create_notes_folder_upload(request):
    if request.method == 'POST':
        folder_name = request.POST.get('folder_name')
        files = request.FILES.getlist('notes')

        if not folder_name or not files:
            return JsonResponse({'error': 'Missing folder name or files'}, status=400)

        # Create the folder
        folder = NotesFolder.objects.create(
            name=folder_name,
            created_by=request.user
        )

        # Save each uploaded file as a Note
        for uploaded_file in files:
            Notes.objects.create(
                folder=folder,
                title=uploaded_file.name,
                file=uploaded_file,
                created_by=request.user  # Assuming BaseContent has this field
            )

        return JsonResponse({'success': True})

    return JsonResponse({'error': 'Only POST allowed'}, status=405)