<script>
    <input type="text" name="${day_name}" size="2" maxlength="2" value="${day_value}"/> /
    <select name="${month_name}">
    {{each months}}
        <option value="${$index+1}"
            {{if $index+1==month_value}}selected="selected"{{/if}}>${$value}</option>
    {{/each}}
    </select> /
    <input type="text" name="${year_name}" size="4" maxlength="4" value="${year_value}"/>
    <input type="hidden" name="${calendar_name}" />
</script>