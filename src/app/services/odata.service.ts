import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OdataService {
    private _defaultDateFormat = 'YYYY-MM-DD';

    private formatDate(dateStr) {
        var date = new Date(dateStr);
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }
    private _isNotEmpty(item) {
        switch (item.dataType) {
            case 'date': {
                return item.dateFrom || item.dateTo;
            }
            case 'enum': {
                if (item.enumBehaviour == 'CB') { // checkboxes (multiple values)
                    return item.value && item.value.length > 0;
                }
                else { // radiobuttons (single value)
                    if (item.value === false) return true;
                    return item.value && item.value != '';
                }
            }
            default: {
                return item.value && item.value != '';
            }
        }
    }

    processFilter(filters, pagerParams = null) {
        var _result;
        if (!(filters.length < 1 || !filters.some(this._isNotEmpty))) {
            _result = '$filter=(';
            var _count = 0;
            for (var i = 0; i < filters.length; i++) {
                var _item = filters[i];
                if (!this._isNotEmpty(_item)) {
                    continue;
                }
                _count++;
                if (_count != 1) {
                    _result += ") and (";
                }
                switch (_item.dataType) {
                    case 'arrayOfObjects': {
                        _result += _item.array + " / any(a: contains(tolower(a / " + _item.name + "), '" + _item.value.toLowerCase() + "'))";
                        break;
                    }
                    case 'date': {
                        // если присутствует только одна дата - искать по одной дате 
                        if (_item.dateFrom) {
                            _result += _item.name + " ge " + this.formatDate(_item.dateFrom);
                        }
                        if (_item.dateTo) {
                            var result = new Date(_item.dateTo);
                            result.setDate(result.getDate() + 1);
                            _result += (_item.dateFrom ? ' and ' : '') + _item.name + " le " + this.formatDate(result);
                        }
                        break;
                    }
                    case 'enum': {
                        if (_item.enumBehaviour == 'CB') { // checkboxes - multiple
                            for (var j = 0; j < _item.value.length; j++) {
                                if (j > 0) {
                                    _result += " or ";
                                }
                                _result += _item.name + " eq '" + _item.value[j] + "'";
                            }
                        } else { // radio - single
                            if (typeof (_item.value) === 'boolean') {
                                _result += _item.name + " eq " + _item.value;
                            }
                            else {
                                _result += _item.name + " eq '" + _item.value + "'";
                            }

                        }
                        break;
                    }
                    case 'amount': {
                        // точность +/- 10 грн 
                        var _val = _item.value * 100;
                        _result += _item.name + " ge " + (_val - 1000)
                            + " and " + _item.name + " le " + (_val + 1000);
                        break;
                    }

                    case 'boolean':
                    case 'bool': {
                        _result += _item.name + " eq " + _item.value; // TODO convert to boolean string
                        break;
                    }
                    case 'number':{
                        _result += _item.name + ' eq ' + _item.value;
                        break;
                    }
                    case 'stringNumber':{
                        _result += _item.name + ' eq ' + "'"+ _item.value +"'";
                        break;
                    }
                    case 'string':
                    default: {
                        _result += "contains(tolower(" + _item.name + "), '" + _item.value.toLowerCase() + "')";
                        break;
                    }
                }
            }
            _result += ')';
        }
        if (pagerParams) {
            if (_result) {
                _result += '&';
            }
            else {
                _result = '';
            }
            _result += '$top=' + pagerParams.perPage
                + '&$skip=' + (pagerParams.perPage * pagerParams.page)
                + '&$count=true';
        }
        return _result;


    }
}