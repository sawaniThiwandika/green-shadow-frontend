
function getAuthToken() {
    return localStorage.getItem('token');
}

function setAuthToken(token) {
    localStorage.setItem('jwtToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('jwtToken');
}

$(document).ready(function () {
    displayUsers();
    $("#userForm").on("submit", function (event) {
        event.preventDefault();

        const email = $("#userEmail").val();
        const password = $("#userPassword").val();
        const role = $("#userRole").val();

        saveUser(email, password, role);

        $("#userForm")[0].reset();
    });

    function saveUser(email, password, role) {
        signUpUser(email, password, role);
    }

    function signUpUser(email, password, role) {
        console.log("User Role: " + role);

        var formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);

        $.ajax({
            url: "http://localhost:5050/api/v1/auth/signUp",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            },
            success: function (response) {
                alert("User signed up successfully");
            },
            error: function (error) {
                alert("Error during sign-up");
                console.error(error);
            }
        });
    }
    // Refresh Token
    function refreshToken() {
        const currentToken = getAuthToken();
        if (currentToken) {
            $.ajax({
                url: "http://localhost:5050/api/v1/auth/refresh",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({token: currentToken}),
                success: function (response) {
                    const newToken = response.token;
                    setAuthToken(newToken);
                },
                error: function (error) {
                    alert("Error refreshing token");
                    console.error(error);
                }
            });
        } else {
            alert("No token available to refresh");
        }
    }


    // Display Users in the table
    function displayUsers() {
        const $userContainer = $("#userContainer");
        $userContainer.empty();

        $.ajax({
            url: "http://localhost:5050/api/v1/user",
            type: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            },
            success: function (users) {
                users.forEach((user, index) => {
                    const userRow = `
                        <tr>
                            <td>${user.userEmail}</td>
                            <td>${user.userRole}</td>
                            
                            <td>
                                <button class="btn btn-info btn-sm view-details-user" data-index="${index}">View</button>
                                <button class="btn btn-warning btn-sm update-user" data-index="${index}">Update</button>
                                <button class="btn btn-danger btn-sm delete-user" data-index="${index}">Delete</button>
                            </td>
                        </tr>
                    `;
                    $userContainer.append(userRow);
                });
            },
            error: function (error) {
                alert("Error fetching users");
                console.error(error);
            }
        });
    }

    $(document).on('click', '.update-user', function () {
        const userIndex = $(this).data('index');


        const userEmail = $("#userTable").find(`tr:eq(${userIndex + 1})`).find("td:eq(0)").text();
        const userRole = $("#userTable").find(`tr:eq(${userIndex + 1})`).find("td:eq(1)").text();


        $("#updateUserEmail").val(userEmail);
        $("#updateUserRole").val(userRole);

        $("#updateUserModal").modal('show');


        $("#updateUserForm").off('submit').on('submit', function (event) {
            event.preventDefault();

            const updatedEmail = $("#updateUserEmail").val();
            const updatedRole = $("#updateUserRole").val();


            $.ajax({
                url: `http://localhost:5050/api/v1/user/${userEmail}`,
                type: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                },
                contentType: "application/json",
                data: JSON.stringify({ userEmail: updatedEmail,userPassword: updatedPassword, userRole: updatedRole }),
                success: function () {
                    alert("User updated successfully");
                    $("#updateUserModal").modal('hide');
                    displayUsers(); // Refresh user list
                },
                error: function (error) {
                    alert("Error updating user");
                    console.error(error);
                }
            });
        });
    });

    $(document).on('click', '.delete-user', function () {
        const userIndex = $(this).data('index');

        const userEmail = $("#userTable").find(`tr:eq(${userIndex + 1})`).find("td:eq(0)").text();

        if (confirm(`Are you sure you want to delete the user ${userEmail}?`)) {
            $.ajax({
                url: `http://localhost:5050/api/v1/user/${userEmail}`,
                type: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                success: function () {
                    alert("User deleted successfully");
                    displayUsers();
                },
                error: function (error) {
                    alert("Error deleting user");
                    console.error(error);
                }
            });
        }
    });



    $(document).on('click', '#refreshTokenButton', function () {
        refreshToken();
    });

    // Logout
    $(document).on('click', '#logOutBtn', function () {
        removeAuthToken();
        alert("Logged out successfully");
    });

});
