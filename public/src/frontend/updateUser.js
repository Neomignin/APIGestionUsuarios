document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('updateUserForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const debugInfo = document.getElementById('debugInfo');
    
    //Debug tecla D
    document.addEventListener('keypress', (e) => {
        if (e.key.toLowerCase() === 'd') {
            debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    
    if (!userId) {
        errorMessage.textContent = 'Error: No se proporcionó ID de usuario';
        return;
    }

    try {
        const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}`);
        const user = response.data[0];
        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        document.getElementById('userName').value = user.userName || '';
        document.getElementById('name').value = user.name || '';
        document.getElementById('first_surname').value = user.first_surname || '';
        document.getElementById('email').value = user.email || '';

        debugInfo.innerHTML = `<pre>Datos cargados del usuario: ${JSON.stringify(user, null, 2)}</pre>`;
    } catch (error) {
        errorMessage.textContent = 'Error al cargar los datos del usuario';
        debugInfo.innerHTML = `<pre>Error al cargar: ${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>`;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        successMessage.textContent = '';
        
        try {
            const formData = {
                userName: document.getElementById('userName').value.trim(),
                name: document.getElementById('name').value.trim(),
                first_surname: document.getElementById('first_surname').value.trim(),
                email: document.getElementById('email').value.trim(),
            };

            const password = document.getElementById('password').value.trim();
            if (password) {
                formData.password = password;
            }

            console.log('Datos a enviar:', formData);

            const response = await axios.put(`http://localhost:3000/api/v1/users/${userId}`, formData);
            
            console.log('Respuesta del servidor:', response.data);

            if (response.data.success) {
                successMessage.textContent = 'Usuario actualizado correctamente';
                setTimeout(() => {
                    window.location.href = 'usersManagement.html';
                }, 2000);
            } else {
                errorMessage.textContent = response.data.message || 'Error al actualizar el usuario';
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            errorMessage.textContent = error.response?.data?.message || 'Error al actualizar el usuario';
            debugInfo.innerHTML = `<pre>Error al actualizar: ${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>`;
        }
    });
});
console.log('Datos a enviar:', formData);
console.log('Respuesta del servidor:', response.data);