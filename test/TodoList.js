import supertest from "supertest"
import { expect, assert } from 'chai';
const request = supertest("http://localhost:3002/api/");
var todoItemID = "";
var updatedRecord = {};

describe('Take a TodoItem through its lifecycle - its creation, its updation, and then marking it as completed', () => {
    const record = {
        "description": "puneet"    
    }
    it('Create a TodoItem: POST/todoItems',() => {        
        return request.post('todoItems').send(record).expect(201).then((res) => {                
            assert.isNotEmpty(res.body);
            //Fetch the ID of the newly posted record
            todoItemID = res.body;                   
        });        
    });
    
    it('Get the newly created TodoItem by its ID and verify it: GET/todoItems/{id}',() => {
        return request.get(`todoItems/${todoItemID}`).expect(200).then((res) => {      
            assert.deepEqual(res.body.id, todoItemID, "ID mismatch");
            assert.deepEqual(res.body.description, record.description, "Description mismatch");
            assert.isFalse(res.body.isCompleted, "Incorrect status");              
        });
    });   
    
    it('Get TodoItem list and verify that it contains the newly created TodoItem: GET/todoItems',() => {
        return request.get('todoItems').expect(200).then((res) => {                
            assert.isArray(res.body);
            assert.lengthOf(res.body, 1, "incorrect number of ToDoItems");
            assert.containsAllKeys(res.body[0], 'id', 'description', 'isCompleted');
            assert.propertyVal(res.body[0], 'id', `${todoItemID}`, 'ID mismatch');
            assert.propertyVal(res.body[0], 'description', `${record.description}`, 'Description mismatch');
            assert.propertyVal(res.body[0], 'isCompleted', false, 'incorrect status');                         
        });        
    });    
    
    it('Update the TodoItem by changing its Description text: PUT/todoItems/{id}',() => {        
        updatedRecord = {
            "id": todoItemID,
            "description": "sahil",
            "isCompleted": false   
        }    
        return request.put(`todoItems/${todoItemID}`).send(updatedRecord).expect(204).then((res) => {                
            assert.isEmpty(res.body);          
                                
        });  
    }); 

    it('Get the updated TodoItem and verify it: GET/todoItems/{id}',() => {        
        return request.get(`todoItems/${todoItemID}`).expect(200).then((res) => {      
            assert.deepEqual(res.body.id, todoItemID, "ID mismatch");
            assert.deepEqual(res.body.description, updatedRecord.description, "Description mismatch");
            assert.isFalse(res.body.isCompleted, "Incorrect status");              
        });
    });
    
    it('Update the TodoItem by marking it as completed: PUT/todoItems/{id}',() => {        
        updatedRecord = {
            "id": todoItemID,
            "description": "sahil",
            "isCompleted": true   
        }    
        return request.put(`todoItems/${todoItemID}`).send(updatedRecord).expect(204).then((res) => {                
            assert.isEmpty(res.body);                               
        });  
    });
    
    it('Get TodoItem list and ensure it does not contain the completed TodoItem: GET/todoItems',() => {
        return request.get('todoItems').expect(200).then((res) => {                
            assert.isArray(res.body);
            assert.lengthOf(res.body, 0, "incorrect number of ToDoItems");                                     
        });        
    });

   it('Get the newly created TodoItem by its ID and verify its updated isCompleted status: GET/todoItems/{id}',() => {
        return request.get(`todoItems/${todoItemID}`).expect(200).then((res) => {      
            assert.deepEqual(res.body.id, todoItemID, "ID mismatch");            
            assert.isTrue(res.body.isCompleted, "Incorrect status");              
        });
    });
});

const invalidTodoItemID = "fc100100-1000-1d6a-1d10-a10f0e10d100";

describe('Test Error Conditions', () => {
           
    it('GET/todoItems/{id} : Using an id value that does not exist',() => {
        return request.get(`todoItems/${invalidTodoItemID}`).expect(404).then((res) => {              
        });
    });
    
    it('PUT/todoItems/{id} : Using an id value that does not exist',() => {        
        updatedRecord = {
            "id": invalidTodoItemID,
            "description": "sahil",
            "isCompleted": false   
        }    
        return request.put(`todoItems/${invalidTodoItemID}`).send(updatedRecord).expect(404).then((res) => {                
            assert.isEmpty(res.body);          
                                
        });  
    }); 
    
});
