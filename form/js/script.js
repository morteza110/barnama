

// Add the novalidate attribute when the JS loads
var forms = document.querySelectorAll('.validate');
for (var i = 0; i < forms.length; i++) {
    forms[i].setAttribute('novalidate', true);
}
// Validate the field
var hasError = function (field) {

    // Don't validate submits, buttons, file and reset inputs, and disabled fields
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;
    // Get validity
    var validity = field.validity;
    // If valid, return null
    if (validity.valid) return;
    // If field is required and empty
    if (validity.valueMissing) return 'فیلد فوق را کامل کنید';
    // If not the right type
    if (validity.typeMismatch) {
      var  phone = document.getElementById('phone').value;
      if (phone.length != 11) {
        return 'شماره تماس وارد شده نامعتبر است';
      }
        // Email
        if (field.type === 'email') return 'لطفا ایمیلتان را وارد کنید';
        // URL
        if (field.type === 'text') return 'لطفا فیلد فوق را پر کنید';
        //phone
        if (field.type === 'tel') return 'لطفا شماره تماس خود را وارد کنید';
    }


    // If number input isn't a number
    if (validity.badInput) return 'خواهشا عدد وارد نمایید';
      // If pattern doesn't match
    if (validity.patternMismatch) {
        // If pattern info is included, return custom error
        if (field.hasAttribute('title')) return field.getAttribute('title');
        // Otherwise, generic error
        return 'خواهشا طبق فرمت خواسته شده وارد نمایید';
    }
    // If all else fails, return a generic catchall error
    return 'مقداری که شما وارد کرده اید، معتبر نمی باشد';
};
// Show an error message
var showError = function (field, error) {
    // Add error class to field
    field.classList.add('error');
    // If the field is a radio button and part of a group, error all and get the last item in the group
    if (field.type === 'radio' && field.name) {
        var group = document.getElementsByName(field.name);
        if (group.length > 0) {
            for (var i = 0; i < group.length; i++) {
                // Only check fields in current form
                if (group[i].form !== field.form) continue;
                group[i].classList.add('error');
            }
            field = group[group.length - 1];
        }
    }
    // Get field id or name
    var id = field.id || field.name;
    if (!id) return;
    // Check if error message field already exists
    // If not, create one
    var message = field.form.querySelector('.error-message#error-for-' + id );
    if (!message) {
        message = document.createElement('div');
        message.className = 'error-message';
        message.id = 'error-for-' + id;
        // If the field is a radio button or checkbox, insert error after the label
        var label;
        if (field.type === 'radio' || field.type ==='checkbox') {
            label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
            if (label) {
                label.parentNode.insertBefore( message, label.nextSibling );
            }
        }
        // Otherwise, insert it after the field
        if (!label) {
            field.parentNode.insertBefore( message, field.nextSibling );
        }
    }
    // Add ARIA role to the field
    field.setAttribute('aria-describedby', 'error-for-' + id);
    // Update error message
    message.innerHTML = error;
};
// Remove the error message
var removeError = function (field) {
    // Remove error class to field
    field.classList.remove('error');
    // Remove ARIA role from the field
    field.removeAttribute('aria-describedby');
    // If the field is a radio button and part of a group, remove error from all and get the last item in the group
    if (field.type === 'radio' && field.name) {
        var group = document.getElementsByName(field.name);
        if (group.length > 0) {
            for (var i = 0; i < group.length; i++) {
                // Only check fields in current form
                if (group[i].form !== field.form) continue;
                group[i].classList.remove('error');
            }
            field = group[group.length - 1];
        }
    }
    // Get field id or name
    var id = field.id || field.name;
    if (!id) return;
    // Check if an error message is in the DOM
    var message = field.form.querySelector('.error-message#error-for-' + id + '');
    if (!message) return;
    // If so, hide it
    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';
};
// Listen to all blur events
document.addEventListener('blur', function (event) {

    // Only run if the field is in a form to be validated
    if (!event.target.form.classList.contains('validate')) return;
    // Validate the field
    var error = hasError(event.target);
    // If there's an error, show it
    if (error) {
        showError(event.target, error);
        return;
    }
    // Otherwise, remove any existing error message
    removeError(event.target);

}, true);
// Check all fields on submit
document.addEventListener('submit', function (event) {
    // Only run on forms flagged for validation
    if (!event.target.classList.contains('validate')) return;
    // Get all of the form elements
    var fields = event.target.elements;
    // Validate each field
    // Store the first field with an error to a variable so we can bring it into focus later
    var error, hasErrors;
    for (var i = 0; i < fields.length; i++) {
        error = hasError(fields[i]);
        if (error) {
            showError(fields[i], error);
            if (!hasErrors) {
                hasErrors = fields[i];
            }
        }
    }
    // If there are errrors, don't submit form and focus on first element with error
    if (hasErrors) {
        event.preventDefault();
        hasErrors.focus();
    }
    // Otherwise, let the form submit normally
    // You could also bolt in an Ajax form submit process here

}, false);
