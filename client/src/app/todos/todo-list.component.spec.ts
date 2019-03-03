import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Todo list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([
        {
          "_id": "58895985a22c04e761776d54",
          "owner": "Blanche",
          "status": false,
          "body": "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.",
          "category": "software design"
        },
        {
          "_id": "58895985c1849992336c219b",
          "owner": "Fry",
          "status": false,
          "body": "Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.",
          "category": "video games"
        },
        {
          "_id": "58895985ae3b752b124e7663",
          "owner": "Fry",
          "status": true,
          "body": "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
          "category": "homework"
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoListComponent],
      // providers:    [ TodoListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.todos.length).toBe(3);
  });

  it('contains a todo owner \'Blanche\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Blanche')).toBe(true);
  });

  it('contain a todo owner \'Fry\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Fry')).toBe(true);
  });

  it('doesn\'t contain a todo owner \'Santa\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
  });

  it('has two todos that are incomplete', () => {
    expect(todoList.todos.filter((todo: Todo) => todo.status === false).length).toBe(2);
  });

  // it('todo list filters by owner', () => {
  //   expect(todoList.filteredTodos.length).toBe(3);
  //   todoList.todoOwner = 'a';
  //   todoList.refreshTodos().subscribe(() => {
  //     expect(todoList.filteredTodos.length).toBe(1);
  //   });
  // });

  it('todo list filters by category', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoCategory = "vid";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
  });

  it('todo list filters by category with letter e', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoCategory = "e";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(3);
    });
  });

  it('todo list filters by body with letter \'e\'', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoBody = "e";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(3);
    });
  });

  it('todo list filters by body with word \'magna\'', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoBody = "magna";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
  });

  it('todo list filters by body with word \'santa\'', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoBody = "santa";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(0);
    });
  });

  // it('todo list filters by category and owner', () => {
  //   expect(todoList.filteredTodos.length).toBe(3);
  //   todoList.todoCategory = "vid";
  //   todoList.todoOwner = 'i';
  //   todoList.refreshTodos().subscribe(() => {
  //     expect(todoList.filteredTodos.length).toBe(0);
  //   });
  // });

});

describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a TodoListService', () => {
    // Since the observer throws an error, we don't expect todos to be defined.
    expect(todoList.todos).toBeUndefined();
  });
});


describe('Adding a todo', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  const newTodo: Todo = {
    _id: '',
    owner: 'Sam',
    status: true,
    body: 'Things and stuff',
    category: 'video games'
  };
  const newId = 'sam_id';

  let calledTodo: Todo;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>,
    addNewTodo: (newTodo: Todo) => Observable<{ '$oid': string }>
  };
  let mockMatDialog: {
    open: (AddTodoComponent, any) => {
      afterClosed: () => Observable<Todo>
    };
  };

  beforeEach(() => {
    calledTodo = null;
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([]),
      addNewTodo: (newTodo: Todo) => {
        calledTodo = newTodo;
        return Observable.of({
          '$oid': newId
        });
      }
    };
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(newTodo);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [
        {provide: TodoListService, useValue: todoListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls TodoListService.addTodo', () => {
    expect(calledTodo).toBeNull();
    todoList.openDialog();
    expect(calledTodo).toEqual(newTodo);
  });
});
