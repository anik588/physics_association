from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError


# ====== Custom User ======
class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        TEACHER = 'TEACHER', _('Teacher')
        STUDENT = 'STUDENT', _('Student')

    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.STUDENT)
    email = models.EmailField(unique=True)

    # Common
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)  # ✅ Only for students, set by admin

    # Student fields
    roll = models.CharField(max_length=20, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], blank=True, null=True)
    session = models.CharField(max_length=20, blank=True, null=True)

    # Teacher fields
    position = models.CharField(max_length=100, blank=True, null=True)
    university = models.CharField(max_length=255, blank=True, null=True)
    education_details = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def clean(self):
        if self.role == self.Roles.STUDENT:
            if not self.roll or not self.gender or not self.session:
                raise ValidationError("Student must have roll, gender and session.")
            self.position = self.university = self.education_details = self.bio = None
        elif self.role == self.Roles.TEACHER:
            if not self.position or not self.university:
                raise ValidationError("Teacher must have position and university.")
            self.roll = self.gender = self.session = None
        else:
            self.roll = self.gender = self.session = None
            self.position = self.university = self.education_details = self.bio = None

    def save(self, *args, **kwargs):
        if not (self.is_staff and self.is_superuser):
            self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"


# ====== BaseContent (Shared) ======
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BaseContent(TimeStampedModel):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    verified_by_teacher = models.BooleanField(default=False)
    verified_by_admin = models.BooleanField(default=False)
    verified_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="verified_%(class)s_set")
    views = models.PositiveIntegerField(default=0)
    starred_by = models.ManyToManyField(User, related_name="starred_%(class)s", blank=True)

    class Meta:
        abstract = True


# ====== Blog ======
class Blog(BaseContent):
    title = models.CharField(max_length=200)
    content = models.TextField(max_length=10000)
    images = models.ImageField(upload_to='blog_images/', blank=True, null=True)

    def __str__(self):
        return self.title


# ====== Research Paper ======
class ResearchPaper(BaseContent):
    title = models.CharField(max_length=200)
    abstract = models.TextField()
    document = models.FileField(upload_to='research_docs/')

    def __str__(self):
        return self.title


# ====== Notes & Folder ======
class NotesFolder(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Notes(BaseContent):
    folder = models.ForeignKey(NotesFolder, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='notes/')
    thumbnail = models.ImageField(upload_to='notes_thumbnails/', blank=True, null=True)

    def __str__(self):
        return self.title


# ====== Video ======
class Video(models.Model):
    title = models.CharField(max_length=200)
    youtube_url = models.URLField()
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ====== Event (moderators only) ======
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_date = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ====== Front Page Slider (admin only) ======
class FrontSlider(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='sliders/')
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

