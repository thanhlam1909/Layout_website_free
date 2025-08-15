    // Hàm giảm số lượng
    function decreaseQuantity(button) {
        var input = button.parentElement.querySelector('input');
        var currentValue = parseInt(input.value);

        if (currentValue > 1) {
            input.value = currentValue - 1;
        }
    }

    // Hàm tăng số lượng
    function increaseQuantity(button) {
        var input = button.parentElement.querySelector('input');
        var currentValue = parseInt(input.value);

        input.value = currentValue + 1;
    }