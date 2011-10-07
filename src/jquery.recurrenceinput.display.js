<script>
    <div class="recurrenceinput_display">
        <div class="recurrenceinput_main">
            {{if !readOnly}}
                <input type="checkbox" name="recurrenceinput_checkbox" />
            {{/if}}            
            <label class="recurrenceinput_display">${i18n.display_label_unactivate}</label>
            {{if !readOnly}}
                <a href="#" name="recurrenceinput_edit">${i18n.edit}</a>
            {{/if}}
        </div>
    </div>
</script>