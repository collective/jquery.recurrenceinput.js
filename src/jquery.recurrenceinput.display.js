<script>
    <div class="${klass.display}">
        <div class="${klass.main}">
            <input type="checkbox" name="${field.checkbox_name}" />
            {{if field.display_text}}
            <span class="${klass.display_text}">
                ${field.display_text}
            </span>
            {{else}}
            <label class="${klass.display_label}">${i18n.display_label_unactivate}</label>
            {{/if}}
            <a href="#" name="${field.edit_name}">Edit...</a>
        </div>
                
    </div>
</script>