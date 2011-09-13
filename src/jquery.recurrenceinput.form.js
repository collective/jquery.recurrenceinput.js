<script>
    <div class="recurrenceinput_form">
        <form>

            <div id="recurrenceinput_rtemplate">
                <label for="recurrenceinput_rtemplate">${i18n.recurrence_type}</span></label>
                <select name="recurrenceinput_rtemplate">
                    {{each rtemplate}}
                        <option value="${$index}">${$value.title}</value>
                    {{/each}}
                </select>
            <div>
        
            <div id="recurrenceinput_daily_interval" class="recurrenceinput_field">
                <label for="recurrenceinput_daily_interval">${i18n.daily_interval_1}</span></label>
                <input type="text" size="2"
                    value="1"
                    name="recurrenceinput_daily_interval"
                    id="recurrenceinput_daily_interval" />
                <label for="recurrenceinput_daily_interval">${i18n.daily_interval_2}</span></label>
                <span>
            </div>

            <div id="recurrenceinput_weekly_interval" class="recurrenceinput_field">
                <label for="recurrenceinput_weekly_interval">${i18n.weekly_interval_1}</label>
                <input type="text" size="2"
                    value="1"
                    name="recurrenceinput_weekly_interval"
                    id="recurrenceinput_weekly_interval"/>
                <label for="recurrenceinput_weekly_interval">${i18n.weekly_interval_2}</label>
            </div>
            <div id="recurrenceinput_weekly_weekdays" class="recurrenceinput_field">
                <label for="recurrenceinput_weekly_interval">${i18n.weekly_weekdays}</label>
                {{each i18n.weekdays}}
                    <input type="checkbox"
                        name="recurrenceinput_weekly_weekdays_${weekdays[$index]}"
                        value="${weekdays[$index]}" />
                    <label for="recurrenceinput_weekly_weekdays_${weekdays[$index]}">${$value}</label>
                {{/each}}
                </ul>
            </div>
    
            <div id="recurrenceinput_monthly_options" class="recurrenceinput_field">
                <div>
                    <input
                        type="radio"
                        value="DAY_OF_MONTH"
                        name="recurrenceinput_monthly_type"
                        id="recurrenceinput_monthly_type:DAY_OF_MONTH" />
                    <label for="recurrenceinput_monthly_type:DAY_OF_MONTH">
                        ${i18n.monthly_day_of_month_1}
                    </label>
                    <select name="recurrenceinput_monthly_day_of_month_day"
                        id="recurrenceinput_monthly_day_of_month_day">
                    {{each [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,
                            18,19,20,21,22,23,24,25,26,27,28,29,30,31]}}
                        <option value="${$value}">${$value}</option>
                    {{/each}}
                    </select>
                    <label for="recurrenceinput_monthly_type:DAY_OF_MONTH">
                        ${i18n.monthly_day_of_month_2}${i18n.monthly_day_of_month_3}
                    </label>
                    <input type="text" size="2"
                        value="1" 
                        name="recurrenceinput_monthly_day_of_month_interval"/>
                    <label for="recurrenceinput_monthly_type:DAY_OF_MONTH">
                        ${i18n.monthly_day_of_month_4}
                    </label>
                </div>
                <div>
                    <input
                        type="radio"
                        value="WEEKDAY_OF_MONTH"
                        name="recurrenceinput_monthly_type"
                        id="recurrenceinput_monthly_type:WEEKDAY_OF_MONTH" />
                    <label for="recurrenceinput_monthly_type:WEEKDAY_OF_MONTH">
                        ${i18n.monthly_weekday_of_month_1}
                    </label>
                    <!-- TODO: could it be multiselect? -->
                    <select name="recurrenceinput_monthly_weekday_of_month_index">
                    {{each i18n.order_indexes}}
                        <option value="${order_indexes[$index]}">${$value}</option>
                    {{/each}}
                    </select>
                    <label for="recurrenceinput_monthly_type:WEEKDAY_OF_MONTH">
                        ${i18n.monthly_weekday_of_month_2}
                    </label>
                    <select name="recurrenceinput_monthly_weekday_of_month">
                    {{each i18n.weekdays}}
                        <option value="${weekdays[$index]}">${$value}</option>
                    {{/each}}
                    </select>
                    <label for="recurrenceinput_monthly_type:WEEKDAY_OF_MONTH">
                        ${i18n.monthly_weekday_of_month_3}
                    </label>
                    <input type="text" size="2"
                        value="1"
                        name="recurrenceinput_monthly_weekday_of_month_interval" />
                    <label for="recurrenceinput_monthly_type:WEEKDAY_OF_MONTH">
                        ${i18n.monthly_weekday_of_month_4}
                    </label>
                </div>
            </div>
    
            <div id="recurrenceinput_yearly_options" class="recurrenceinput_field">
                <div>
                    <input
                        type="radio"
                        value="DAY_OF_MONTH"
                        name="recurrenceinput_yearly_type"
                        id="recurrenceinput_yearly_type:DAY_OF_MONTH" />
                    <label for="recurrenceinput_yearly_type:DAY_OF_MONTH">
                        ${i18n.yearly_day_of_month_1}
                    </label>
                    <select name="recurrenceinput_yearly_day_of_month">
                    {{each i18n.months}}
                        <option value="${$index+1}">${$value}</option>
                    {{/each}}
                    </select>
                    <label for="recurrenceinput_yearly_type:DAY_OF_MONTH">
                        ${i18n.yearly_day_of_month_2}
                    </label>
                    <select name="recurrenceinput_yearly_day_of_month_index">
                    {{each [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,
                            18,19,20,21,22,23,24,25,26,27,28,29,30,31]}}
                        <option value="${$value}">${$value}</option>
                    {{/each}}
                    </select>
                    <label for="recurrenceinput_yearly_type:DAY_OF_MONTH">
                        ${i18n.yearly_day_of_month_3}
                    </label>
                </div>
                <div>
                    <input
                        type="radio"
                        value="WEEKDAY_OF_MONTH"
                        name="recurrenceinput_yearly_type"
                        id="recurrenceinput_yearly_type:WEEKDAY_OF_MONTH"/>
                    <label for="recurrenceinput_yearly_type:WEEKDAY_OF_MONTH">
                        ${i18n.yearly_weekday_of_month_1}
                    </label>
                    <select name="recurrenceinput_yearly_weekday_of_month_index">
                    {{each i18n.order_indexes}}
                        <option value="${order_indexes[$index]}">${$value}</option>
                    {{/each}}
                    </select>
                    <label for="recurrenceinput_yearly_type:WEEKDAY_OF_MONTH">
                        ${i18n.yearly_weekday_of_month_2}
                    </label>
                    <select name="recurrenceinput_yearly_weekday_of_month_day">
                    {{each i18n.weekdays}}
                        <option value="${weekdays[$index]}">${$value}</option>
                    {{/each}}
                    </select>
                    <label for="recurrenceinput_yearly_type:WEEKDAY_OF_MONTH">
                        ${i18n.yearly_weekday_of_month_3}
                    </label>
                    <select name="recurrenceinput_yearly_weekday_of_month_month">
                    {{each i18n.months}}
                        <option value="${$index+1}">${$value}</option>
                    {{/each}}
                    </select>
                    <label for="recurrenceinput_yearly_type:WEEKDAY_OF_MONTH">
                        ${i18n.yearly_weekday_of_month_4}
                    </label>                    
                </div>
            </div>
                
            <div id="recurrenceinput_range_options" class="recurrenceinput_field">
                <label>${i18n.range_label}</label>
                <div>
                    <input
                        type="radio"
                        value="NO_END_DATE"
                        name="recurrenceinput_range_type"
                        id="recurrenceinput_range_type:NO_END_DATE"/>
                    <label for="recurrenceinput_range_type:NO_END_DATE">
                        ${i18n.range_no_end_label}
                    </label>                    
                </div>
                <div>
                    <input
                        type="radio"
                        value="BY_OCCURRENCES"
                        name="recurrenceinput_range_type"
                        id="recurrenceinput_range_type:BY_OCCURRENCES"/>
                    <label for="recurrenceinput_range_type:BY_OCCURRENCES">
                        ${i18n.range_by_occurrences_label_1}
                    </label>                    
                    <input
                        type="text" size="3"
                        value="10"
                        name="recurrenceinput_range_by_occurrences_value" />
                    <label for="recurrenceinput_range_type:BY_OCCURRENCES">
                        ${i18n.range_by_occurrences_label_2}
                    </label>                    
                </div>
                <div>
                    <input
                        type="radio"
                        value="BY_END_DATE"
                        name="recurrenceinput_range_type"
                        id="recurrenceinput_range_type:BY_END_DATE"/>
                    <label for="recurrenceinput_range_type:BY_END_DATE">
                        ${i18n.range_by_end_date_label}
                    </label>                    
                    <input
                        type="date" 
                        name="recurrenceinput_range_by_end_date_calendar" />
                </div>
            </div>
        
            <div class="recurrenceinput_buttons">
                <input
                    type="submit"
                    class="recurrenceinput_cancel_button"
                    value="${i18n.cancel_button_label}" />
                <input
                    type="submit"
                    class="recurrenceinput_save_button"
                    value="${i18n.save_button_label}" />
            </div>
        </form>
    </div>
</script>