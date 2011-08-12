<script>
    <div class="${klass.display}">
        <input type="checkbox" name="${field.checkbox_name}" />
        {{if field.display_text}}
        <label>${i18n.display_label_activate}</label>
        {{else}}
        <span class="${klass.display_text}">
            ${field.display_text}
        </span>
        <label>${i18n.display_label_unactivate}</label>
        {{/if}}
        <a href="#" name="${field.edit_name}">Edit...</a>
    </div>
</script>