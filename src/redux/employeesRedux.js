import {createSlice} from "@reduxjs/toolkit"

export const employeesSlice = createSlice({
    name:"employee",
    initialState:{
        employees:[],
        isFetching:false,
        error:false
    },
    reducers:{
        //get all employees
        getEmployeesStart:(state) => {
            state.isFetching = true
            state.error = false
        },
        getEmployeesSuccess:(state,action) => {
            state.isFetching = false
            state.employees = action.payload
        },
        getEmployeesFailure:(state) => {
            state.isFetching = false
            state.error = true
        },

         //create employee
         createEmployeeStart:(state) => {
            state.isFetching = true
            state.error = false
        },
        createEmployeeSuccess:(state,action) => {
            state.isFetching = false
            state.employees.push(action.payload)
        },
        createEmployeeFailure:(state) => {
            state.isFetching = false
            state.error = true
        },

        //updating an employee
        updateEmployeeStart:(state) => {
            state.isFetching = true,
            state.error = true
        },
        updateEmployeeSuccess:(state,action) => {
            state.isFetching = false
            const {employee} = action.payload
            //find the index of the employee in the state array
            const index = state.employees.findIndex((item) => item._id === item.id)
            if(index !== -1){
                //create a new object with the merged properties of the existing employee and the updated one
                const updatedEmployee = {...state.employees[index],...employee}
                //update the employee at the specified index with the merged employee
                state.employees[index] = updatedEmployee
            }
        },
        updateEmployeeFailure:(state) => {
            state.isFetching = false
            state.error = true
        },

        //deleting an employee
        deleteEmployeeStart:(state) => {
            state.isFetching = true
            state.error = false
        },
        deleteEmployeeSuccess:(state,action) => {
            state.isFetching = false
            state.employees.splice(state.employees.findIndex((item) => item._id === action.payload),1)
        },
        deleteEmployeeFailure:(state) => {
            state.isFetching = false
            state.error = true
        }

    }
})

export const {createEmployeeStart,createEmployeeSuccess,createEmployeeFailure,
             getEmployeesStart,getEmployeesSuccess,getEmployeesFailure,
            updateEmployeeStart,updateEmployeeSuccess,updateEmployeeFailure,
            deleteEmployeeStart,deleteEmployeeSuccess,deleteEmployeeFailure } = employeesSlice.actions

export default employeesSlice.reducer