function testSubmitForm() {
    const form = document.forms["search"];
    form.addEventListener('submit', search, false);

    /** @type {EventListener} */
    function search(event) {
        event.preventDefault();
        alert(`You searched for ${input.value}`);
    }
}