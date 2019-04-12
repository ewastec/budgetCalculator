/** 
 * Architecture
 * 
 * module with a module pattern
 * module patter returns an objects that we want to make public
 * budgetController.publicfunction(10); returns 20;
 * clotgers, ify
 * module can recive arguments.
 */

/**
 * budget controller
 * 
 * obj data 
 * budget calculation
 */
var budgetController = (function(){
    
    //private
    // function constructor, you can put methods to the prototype
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }; 
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }; 
    
    // we will store the incomes and expences in an array
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    //private method 
    var calculateTotal = function(type){
        var total = 0;
        // forEach acepts the call back function
        data.allItems[type].forEach(function(curent, index, array){
            if(type === 'exp'){
                console.log(curent); 
                total += curent.value;
            }else if(type = 'inc'){
                console.log(curent); 
                total += curent.value;
            }
        });
        data.totals[type] = total;
        console.log(total); 
    };

    // returns object, containing methods, that are public
    return {
        addItem: function(type, des, val){
            var newItem, ID;

            // create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }

            // create new item
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // push it to the data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },
        deleteItem: function(type, id){
            console.log(type);
            console.log(id);
            var ids, index;
            // id = 4
            // ids = [1 2 4 5 7 9]
            // index = 3
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            console.log(ids);
            // check which index has the search id
            index = ids.indexOf(id);
            console.log(index);
            if(index !== -1){
                var test = data.allItems[type].splice(index, 1); // income object that we want to delete
                console.log(test);
            }
        },
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income minus expenses
            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0){
                // calculate the procentage of income
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function(){
            console.log(data);
            return data;
        }
    }      
})();


/**
 * user iterface controller
 * event listener
 * display new element on the page
 * read the input fields
 * clear the input fields
 */
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expensesContainer:'.expenses__list',
        budgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpenses: '.budget__expenses--value',
        budgetExpensesPercentage: '.budget__expenses--percentage',
        container: '.container'
    };

    // returns object, containing methods, that are public
    return {
        getInput: function(){                   
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            };
        },
        addListItem: function(obj, type){
            var html, newHTML, element; 
            // create a HTML string with place holder text
           if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }else if(type === 'exp'){
                element= DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">1%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           };

            // replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            if(obj.percentage){
                newHTML = newHTML.replace('%percentage%', obj.percentage)
            }

            // insert the HTML into the DOM
            var el = document.querySelector(element);
            if(el != null){
                el.insertAdjacentHTML('beforeend', newHTML );
            }
        },
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function(){
            var fields, fieldsArray;
            // querySelectorAll return list( NodeList), we have to convert it in to array
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(curent, index, array){
                curent.value = "";
            });
            fieldsArray[0].focus();
        },
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;
            document.querySelector(DOMstrings.budgetIncome).textContent = obj.totalInc;
            document.querySelector(DOMstrings.budgetExpenses).textContent = obj.totalExp;

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.budgetExpensesPercentage).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.budgetExpensesPercentage).textContent = '---';
            }

        },
        getDOMstring: function(){
            return DOMstrings;
        }
    }; 
})();

/**
 * Application controller
 * 
 * event listeners
 */
var APcontroller = (function(budgetCtrl, UICtr){
    var setEventListeners = function(){
        var DOM = UICtr.getDOMstring();
        // event listener
        document.querySelector('.add__btn').addEventListener('click', ctrAddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem);
    };

    
    var updateBudget = function(type){
        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on the UI
        UICtr.displayBudget(budget);
    };

    // this module is a controll center
    var ctrAddItem = function(){
        var input, newItem;

        // 1. get the input data
        input = UICtr.getInput();
        console.log(input);
        
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            // 2. add the item to the budget
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add the new item to the user interface UI
            UIController.addListItem(newItem, input.type);

            // 4. clear all filds
            UIController.clearFields();

            // 5.calculate and update the budget
            updateBudget(input.type);

            // display the budget
        }
    };
    
    var ctrDeleteItem = function(event){
        //console.log(event.target); => .ion-ios-close-outline
        //console.log(event.target.parentNode); => .item__delete--btn
        //console.log(event.target.parentNode.parentNode.parentNode.parentNode); => .item clearfix 
        //console.log(event.target.parentNode.parentNode.parentNode.parentNode.id); => #inc-0
        var itemID, splitID, type, ID;
        // not the best solution, it's hard coded; if the structure change it will target diffrent element, but we also hard coded html structure for income and expenses
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // #inc-0, exp-1
        // if the id is defined
        if(itemID){
            splitID = itemID.split('-'); // returns an array ["inc", "1"]
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from the UI, user interface
            UICtr.deleteListItem(itemID);

            // 3. update and show the new budget
            updateBudget(type);
        }

    };
    
    //public initialization function
    return {
        init: function(){
            console.log('init');
            UICtr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setEventListeners();
        }
    }
})(budgetController, UIController);

APcontroller.init();



/*
var budgetController = (function(){
    // private variable
    var x = 10;
    // private add method
    var add = function(a){
        return x+a;
    };
    // returns object, containing methods, that are public
    return {
        publicfunction: function(b){
            return add(b);
        }
    }      
})();
var UIController = (function(){

})();
var APcontroller = (function(budgetCtrl, UICtr){
    var numb = budgetController.publicfunction(5);
    return{
        newfunction: function(){
            return numb;
        }
    }
})(budgetController, UIController);
*/
// APcontroller.newfunction(); return 15;