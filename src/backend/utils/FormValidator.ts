interface UserFormData {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
}

class FormValidator {
    private form: HTMLFormElement;
    private errorMessages: Map<string, string>;

    constructor(formId: string) {
        this.form = document.querySelector(`#${formId}`) as HTMLFormElement;
        this.errorMessages = new Map();
        this.initializeValidation();
    }

    private initializeValidation(): void {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        const inputs = this.form.querySelectorAll('input');
   
    }

    private validateField(input: HTMLInputElement): boolean {
        const value = input.value.trim();
        const fieldName = input.name;
        
        switch(fieldName) {
            case 'username':
                return this.validateUsername(value);
            case 'name':
                return this.validateName(value, fieldName);
            case 'surname':
                return this.validateName(value, fieldName);
            case 'email':
                return this.validateEmail(value);
            case 'password':
                return this.validatePassword(value);
            default:
                return true;
        }
    }

    private validateUsername(value: string): boolean {
        if (value.length < 5) {
            this.showError('username', 'El nombre de usuario debe tener al menos 5 caracteres');
            return false;
        }
        this.removeError('username');
        return true;
    }

    private validateName(value: string, fieldName: string): boolean {
        if (value.length < 1) {
            this.showError(fieldName, `El ${fieldName === 'name' ? 'nombre' : 'apellido'} no puede estar vacío`);
            return false;
        }
        this.removeError(fieldName);
        return true;
    }

    private validateEmail(value: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.showError('email', 'Email inválido');
            return false;
        }
        this.removeError('email');
        return true;
    }

    private validatePassword(value: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[|@#$%&])[A-Za-z\d|@#$%&]{8,}$/;
        if (!passwordRegex.test(value)) {
            this.showError('password',  'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (|@#$%&)');
            return false;
        }
        this.removeError('password');
        return true;
    }

    private showError(fieldName: string, message: string): void {
        const input = this.form.querySelector(`#${fieldName}-field`) as HTMLInputElement;
        let errorDiv = input.parentElement?.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            input.parentElement?.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        input.classList.add('error');
        this.errorMessages.set(fieldName, message);
    }

    private removeError(fieldName: string): void {
        const input = this.form.querySelector(`#${fieldName}-field`) as HTMLInputElement;
        const errorDiv = input.parentElement?.querySelector('.error-message');
        
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
        this.errorMessages.delete(fieldName);
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input as HTMLInputElement)) {
                isValid = false;
            }
        });

        if (isValid) {
            try {
                const formData = new FormData(this.form);
                const response = await fetch(this.form.action, {
                    method: this.form.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.get('username'),
                        name: formData.get('name'),
                        surname: formData.get('surname'),
                        email: formData.get('email'),
                        password: formData.get('password')
                    }),
                });

                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    console.error("Error al registrar el usuario:", errorData.message);
                    this.showError('form', errorData.message || "Error al registrar el usuario");
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                this.showError('form', "Error al enviar el formulario");
            }
        }
    }
} 

export default FormValidator;