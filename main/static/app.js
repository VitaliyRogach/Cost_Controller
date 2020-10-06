
// Budget Controller 
var budgetController = (function () {

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: [],
            exp: []
        },
        budget: 0,
        percentege: -1
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (element) {
            sum += element.value;
        });

        data.totals[type] = sum;
    }

    return {
        putItem: function (type, desc, value) {
            var id, newItem;

            if (data.allItems[type].length > 0) {
                id = (data.allItems[type][data.allItems[type].length - 1].id + 1);
            } else {
                id = 0;
            }

            if (type === 'inc') {
                newItem = new Income(id, desc, value);
            } else if (type === 'exp') {
                newItem = new Expense(id, desc, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        calculateBudget: function () {

            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentege = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentege = -1;
            }
        },

        deleteItem: function (id, type) {
            data.allItems[type].splice(data.allItems[type].map(function (e) { return e.id; }).indexOf(parseInt(id)), 1);
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentege: data.percentege
            };
        }
    }

})();



// UI Controller 
var UIController = (function () {

    UIDom = {
        add_btn: '.add__btn',
        data_type: '.add__type',
        data_description: '.add__description',
        data_value: '.add__value',
        income_list: '.income__list',
        expense_list: '.expenses__list',
        input_description: '.add__description',
        input_value: '.add__value',
        total_budget: '.budget__value',
        income_label: '.budget__income--value',
        expenses_lable: '.budget__expenses--value',
        percentege_label: '.budget__expenses--percentage',
        delete_btn: '.item__delete--btn',
        container: '.container'
    };



    return {
        getInput: function () {
            return {
                type: document.querySelector(UIDom.data_type).value,
                description: document.querySelector(UIDom.data_description).value,
                value: parseFloat(document.querySelector(UIDom.data_value).value)
            };
        },

        showItem: function (item, type) {
            var html, newHtml, doc;

            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%">' +
                    '<div class="item__description">%desc%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">+ %value%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                doc = UIDom.income_list;
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="exp-%id%">' +
                    '<div class="item__description">%desc%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">- %value%</div>' +
                    '<div class="item__percentage">21%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                doc = UIDom.expense_list;

            }

            newHtml = html.replace('%desc%', item.description);
            newHtml = newHtml.replace('%value%', item.value);
            newHtml = newHtml.replace('%id%', item.id);

            document.querySelector(doc).insertAdjacentHTML("beforeend", newHtml);

        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(UIDom.input_description + ', ' + UIDom.input_value);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(element => {
                element.value = "";
            });
        },

        updateBudget: function (budget) {
            document.querySelector(UIDom.total_budget).textContent = budget.budget;
            document.querySelector(UIDom.income_label).textContent = budget.totalInc;
            document.querySelector(UIDom.expenses_lable).textContent = budget.totalExp;
            if (budget.percentege > 0) {
                document.querySelector(UIDom.percentege_label).textContent = budget.percentege;
            } else {
                document.querySelector(UIDom.percentege_label).textContent = '---';
            }
        },

        deleteItem: function (itemId) {
            var element,
                element = document.getElementById(itemId);
            element.parentNode.removeChild(element);
        },

        getUIDom: function () {
            return UIDom;
        }
    }

})();


// Main controller 
var controller = (function (budgetCntrl, UICntrl) {
    var UIDom;

    function setUpEventListener() {
        document.querySelector(UIDom.add_btn).addEventListener('click', addItem);
        // Handle enter press
        document.addEventListener('keypress', function () {
            if (event.keyCode === 13) {
                addItem();
            }
        });

        document.querySelector(UIDom.container).addEventListener('click', deleteItem);


    }

    var deleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];
        }

        budgetCntrl.deleteItem(ID, type);

        UICntrl.deleteItem(itemID);

        updateBudget();

    }

    var updateBudget = function () {

        // Calculate budget
        budgetCntrl.calculateBudget();

        // Get budget 
        var budget = budgetCntrl.getBudget();

        UICntrl.updateBudget(budget);

    }


    function addItem() {
        var input, newItem;

        // get data from ui 
        input = UICntrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // put data into model 
            newItem = budgetCntrl.putItem(input.type, input.description, input.value);
            // show data 
            UICntrl.showItem(newItem, input.type);
            // clear input fields 
            UICntrl.clearFields();
            // calculate the badgets
            updateBudget();
        }
    }

    return {
        init: function () {
            console.log('Init');
            UIDom = UICntrl.getUIDom();
            UICntrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentege: -1
            })
            setUpEventListener();
        }
    }
})(budgetController, UIController);

controller.init();
