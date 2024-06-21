from django import forms
from .models import Group

class GroupForm(forms.ModelForm):
    name = forms.CharField(label="Назва групи")
    class Meta:
        model = Group
        fields = ['name']
        

    def __init__(self, *args, **kwargs):
        super(GroupForm, self).__init__(*args, **kwargs)
        self.fields['name'].widget.attrs.update({'class': 'input'})
        self.fields['name'].widget.attrs.update({'placeholder': 'Введіть назву групи'})