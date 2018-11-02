$(document).ready(function() {
    $(".deleteUser").on("click", deleteUser);
    // $("form.toSubmit").on("submit", submitForm);
});

function submitForm() {
    // e.preventDefault();

    var name = $("input[name='name']").val();
    var email = $("input[name='email']").val();
    var data = {
        name: name,
        email: email
    };

    $.ajax({
        type: "POST",
        url: "/users/add",
        data: data,
        error: (err) => {
            console.log("something went wrong somewhere; ", err);
        }
    });
};

function deleteUser() {
    var id = $(this).data("id");
    var confirmation = confirm("are you sure?");
    if (confirmation) {
        $.ajax({
            type: "DELETE",
            url: "/users/delete/" + id,
            error: function(err) {
                console.log("something went wrong somewhere; ", err);
            },
            success: function() {
                window.location.replace("/");
            }
        });
    } else {
        return false;
    }
};