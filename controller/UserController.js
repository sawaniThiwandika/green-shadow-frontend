import { UserModel } from "../model/UserModel.js";
import { userList } from "../Db/db.js";

$(document).ready(function() {
    // Save User
    function saveUser(email, password, role) {
        const newUser = new UserModel(email, password, role);
        userList.push(newUser);
        displayUsers();
    }

    // Update User
    function updateUser(index, email, password, role) {
        const user = userList[index];
        if (user) {
            user.email = email;
            user.password = password;
            user.role = role;
            displayUsers();
        } else {
            console.error("User not found at index:", index);
        }
    }

    // Delete User
    function deleteUser(index) {
        userList.splice(index, 1);
        displayUsers();
    }

    // Display Users in the table
    function displayUsers() {
        const $userContainer = $("#userContainer");
        $userContainer.empty();

        userList.forEach((user, index) => {
            const userRow = `
                <tr>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-info btn-sm view-details-user" data-index="${index}">View</button>
                        <button class="btn btn-warning btn-sm update-user" data-index="${index}">Update</button>
                        <button class="btn btn-danger btn-sm delete-user" data-index="${index}">Delete</button>
                    </td>
                </tr>
            `;
            $userContainer.append(userRow);
        });
    }


    function prepareUpdateUser(index) {
        const user = userList[index];
        if (user) {
            // Set values in the modal
            $("#userEmail").val(user.email);
            $("#userPassword").val(user.password);
            $("#userRole").val(user.role);
            $("#submitUser").attr("data-index", index);

            // Update modal title and button text
            $('#addUserModalLabel').text("Update User");
            $('#submitUser').text("Update User");
        }
    }


    $("#userForm").on("submit", function(event) {
        event.preventDefault();

        const email = $("#userEmail").val();
        const password = $("#userPassword").val();
        const role = $("#userRole").val();
        const index = $("#submitUser").attr("data-index");

        if (index) {
            // Update existing user
            updateUser(index, email, password, role);
            $("#submitUser").removeAttr("data-index");
        } else {
            // Save new user
            saveUser(email, password, role);
        }

        // Reset form and hide modal
        $("#userForm")[0].reset();
        $('#addUserModal').modal('hide');

        // Reset modal title and button text
        $('#addUserModalLabel').text("Add New User");
        $('#submitUser').text("Add User");
    });

    // View User (for View action)
    $(document).on('click', '.view-details-user', function() {
        const index = $(this).data('index');
        const user = userList[index];
        if (user) {
            alert(`Viewing details for: ${user.email}`);
        }
    });

    // Update User
    $(document).on('click', '.update-user', function() {
        const index = $(this).data('index');
        prepareUpdateUser(index);
        $('#addUserModal').modal('show');
    });

    // Delete User
    $(document).on('click', '.delete-user', function() {
        const index = $(this).data('index');
        if (confirm("Are you sure you want to delete this user?")) {
            deleteUser(index);
        }
    });

    // Initial display of users
    displayUsers();
});
