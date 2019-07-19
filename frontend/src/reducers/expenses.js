const expensesReducer = (state, action) => {
    switch (action.type) {
    case 'POPULATE_ EXPENSES':
        return action.expenses;
    case 'ADD_EXPENSE':
        return [
            ...state,
            { title: action.title, body: action.body }
        ];
    case 'REMOVE_EXPENSE':
        return state.filter((expense) => expense.title !== action.title);
    default:
        return state;
    }
};

export { expensesReducer as default };