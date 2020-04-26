$(function() {
    "use strict";
    var nameExp = /[^A-Z ]{3,30}/g,emailExp = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,}$/i,mobilenumberExp = /^[0-9]{10,10}$/;
    $('.name').bind('keyup', function(){
        var i = $(this);
        i.val(i.val().replace(/[^a-zA-Z ]/g, function(){
        i.addClass('is-invalid');
        i.next('.invalid-feedback').html('no special characters are allowed');
        setTimeout(function(){i.removeClass('is-invalid')}, 1000);
        return '';
        }));
    });
    $('.name').bind('blur',function(){
        if($(this).val() !== ''){
        if (nameExp.test(this.value)){$(this).removeClass('is-invalid');}
        else{$(this).addClass('is-invalid');$(this).next('.invalid-feedback').html('name should be aleast 3 and maximum 35 characters.');}
        }
    });
    $('.email').bind('blur',function(){
        if($(this).val() !== ''){
        if (emailExp.test(this.value)){
            if($(this).next('.invalid-feedback').html() !== 'email already exists'){
            $(this).removeClass('is-invalid');
            }
        }
        else{$(this).addClass('is-invalid');$(this).next('.invalid-feedback').html('Invalid email');}
        }
    });
    $('.mobilenumber').bind('blur', function(){
        if($(this).val() !== ''){
        if (mobilenumberExp.test(this.value)){$(this).removeClass('is-invalid');}
        else{$(this).addClass('is-invalid');$(this).next('.invalid-feedback').html('Please enter a 10 digit phone number');}
        }
    });
    $(".confirmpassword").bind('keyup blur', function(){
        if($(this).val() !== '' && $('.password').val() !== ''){
        if($('.password').val() === $(this).val()){$(this).removeClass('is-invalid');}
        else{$(this).addClass('is-invalid');$(this).next('.invalid-feedback').html('Please enter the same password again.');}
        }
    });
});