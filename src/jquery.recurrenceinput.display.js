<script>
    <div class="${klass.display}">
        <div class="${klass.main}">
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
        
        <div class="${klass.range}">
            <label>${i18n.range_label}</label>
            <ul>
                <li>
                    <input
                        type="radio"
                        value="${field.range_no_end}"
                        name="${field.range_type_name}" />
                    <label>${i18n.range_no_end_label}</label>
                </li>
                <li>
                    <input
                        type="radio"
                        value="${field.range_by_ocurrences}"
                        name="${field.range_type_name}" />
                    <label>${i18n.range_by_occurences_label}</label>
                    <input
                        type="text" size="3"
                        value="${field.range_by_ocurrences_value}"
                        name="${field.range_by_ocurrences_value_name}" />
                </li>
                <li>
                    <input
                        type="radio"
                        value="${field.range_by_end_date}"
                        name="${field.range_type_name}" />
                    <label>${i18n.range_by_end_date_label}</label>
                    <input
                        type="date" 
                        name="${field.range_by_end_date_calendar_name}" />
                </li>
            </ul>
        </div>
        
    </div>
</script>