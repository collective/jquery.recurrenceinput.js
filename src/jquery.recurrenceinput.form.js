<script>
    <div class="${klass.form}">
        <form>

            <div id="${field.rtemplate_name}">
                <select name="${field.rtemplate_name}">
                    {{each rtemplate}}
                        <option value="${$index}">${$value.title}</value>
                    {{/each}}
                </select>
            <div>
        
            <div id="${field.daily_interval_name}" class="recurrenceinput_field">
                <span>${i18n.daily_interval}<span>
                <input type="text" size="2"
                    value="${field.daily_interval_value}"
                    name="${field.daily_interval_name}"/>
            </div>

            <div id="${field.weekly_interval_name}" class="recurrenceinput_field">
                <span>${i18n.weekly_interval}<span>
                <input type="text" size="2"
                    value="${field.weekly_interval_value}"
                    name="${field.weekly_interval_name}" />
                <ul>
            </div>
            <div id="${field.weekly_weekdays_name}" class="recurrenceinput_field">
                {{each i18n.weekdays}}
                    <input type="checkbox"
                        name="${field.weekly_weekdays_name}_${weekdays[$index]}"
                        value="${weekdays[$index]}" />
                    <label>${$value}</label>
                {{/each}}
                </ul>
            </div>
    
            <div id="${field.monthly_options_name}" class="recurrenceinput_field">
                <div>
                    <input
                        type="radio"
                        value="${field.monthly_day_of_month_value}"
                        name="${field.monthly_type_name}" />
                    <span>${i18n.monthly_day_of_month}</span>
                    <select name="${field.monthly_day_of_month_day_name}">
                    {{each [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,
                            18,19,20,21,22,23,24,25,26,27,28,29,30,31]}}
                        <option value="${$value}">${$value}</option>
                    {{/each}}
                    </select>
                    <input type="text" size="2"
                        value="${field.monthly_day_of_month_interval_value}" 
                        name="${field.monthly_day_of_month_interval_name}"/>
                </div>
                <div>
                    <input
                        type="radio"
                        value="${field.monthly_weekday_of_month_value}"
                        name="${field.monthly_type_name}" />
                    <span>${i18n.monthly_weekday_of_month}</span>
                    <!-- TODO: could it be multiselect? -->
                    <select name="${field.monthly_weekday_of_month_index_name}">
                    {{each i18n.order_indexes}}
                        <option value="${order_indexes[$index]}">${$value}</option>
                    {{/each}}
                    </select>
                    <select name="${field.monthly_weekday_of_month_name}">
                    {{each i18n.weekdays}}
                        <option value="${weekdays[$index]}">${$value}</option>
                    {{/each}}
                        <option value="${field.yearly_weekday_of_month_weekday_value}">
                            ${i18n.yearly_weekday_of_month_weekday}</option>
                        <option value="${field.yearly_weekday_of_month_weekend_day_value}">
                            ${i18n.yearly_weekday_of_month_weekend_day}</option>
                    </select>
                    </select>
                    <input type="text" size="2"
                        value="${field.monthly_weekday_of_month_interval_value}"
                        name="${field.monthly_weekday_of_month_interval_name}" />
                </div>
            </div>
    
            <div id="${field.yearly_options_name}" class="recurrenceinput_field">
                <div>
                    <input
                        type="radio"
                        value="${field.yearly_day_of_month_value}"
                        name="${field.yearly_type_name}" />
                    <span>${i18n.yearly_day_of_month}</span>
                    <select name="${field.yearly_day_of_month_name}">
                    {{each months}}
                        <option value="${$index+1}">${$value}</option>
                    {{/each}}
                    </select>
                    <select name="${field.yearly_day_of_month_index_name}">
                    {{each [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,
                            18,19,20,21,22,23,24,25,26,27,28,29,30,31]}}
                        <option value="${$value}">${$value}</option>
                    {{/each}}
                    </select>
                </div>
                <div>
                    <input
                        type="radio"
                        value="${field.yearly_weekday_of_month_value}"
                        name="${field.yearly_type_name}" />
                    <span>${i18n.yearly_weekday_of_month}</span>
                    <select name="${field.yearly_weekday_of_month_index_name}">
                    {{each i18n.order_indexes}}
                        <option value="${order_indexes[$index]}">${$value}</option>
                    {{/each}}
                    </select>
                    <select name="${field.yearly_weekday_of_month_name}">
                    {{each i18n.weekdays}}
                        <option value="${weekdays[$index]}">${$value}</option>
                    {{/each}}
                        <option value="${field.yearly_weekday_of_month_weekday_value}">
                            ${i18n.yearly_weekday_of_month_weekday}</option>
                        <option value="${field.yearly_weekday_of_month_weekend_day_value}">
                            ${i18n.yearly_weekday_of_month_weekend_day}</option>
                    </select>
                    <select name="${field.yearly_weekday_of_month_month_name}">
                    {{each months}}
                        <option value="${$index+1}">${$value}</option>
                    {{/each}}
                    </select>
                </div>
            </div>
                
            <div id="${field.range_options_name}" class="recurrenceinput_field">
                <label>${i18n.range_label}</label>
                <div>
                    <input
                        type="radio"
                        value="${field.range_no_end}"
                        name="${field.range_type_name}" />
                    <label>${i18n.range_no_end_label}</label>
                </div>
                <div>
                    <input
                        type="radio"
                        value="${field.range_by_ocurrences}"
                        name="${field.range_type_name}" />
                    <label>${i18n.range_by_occurences_label}</label>
                    <input
                        type="text" size="3"
                        value="${field.range_by_ocurrences_value}"
                        name="${field.range_by_ocurrences_value_name}" />
                </div>
                <div>
                    <input
                        type="radio"
                        value="${field.range_by_end_date}"
                        name="${field.range_type_name}" />
                    <label>${i18n.range_by_end_date_label}</label>
                    <input
                        type="date" 
                        name="${field.range_by_end_date_calendar_name}" />
                </div>
            </div>
        
            <div class="${klass.clear}"><!-- --></div>
    
            <div class="${klass.buttons}">
                <input
                    type="submit"
                    class="${klass.cancel_button}"
                    value="${i18n.cancel_button_label}" />
                <input
                    type="submit"
                    class="${klass.save_button}"
                    value="${i18n.save_button_label}" />
            </div>
        </form>
    </div>
</script>