import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import {AddUserComponent} from './add-user.component';
import {CustomModule} from '../custom.module';
import {By} from "@angular/platform-browser";
import {NgForm} from "@angular/forms";

describe('Add user component', () => {

    let addUserComponent: AddUserComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<AddUserComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [AddUserComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: null },
                { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }]
        }).compileComponents().catch(error => {
            expect(error).toBeNull();
        });
    }));

    beforeEach(() => {
        calledClose = false;
        fixture = TestBed.createComponent(AddUserComponent);
        addUserComponent = fixture.componentInstance;
    });

    //it("doesn't send any data about the new user to create if the person clicks on exit", () => {
    //    expect(mockMatDialogRef.data).toBe(null);
    //});

    //I added some import statements here that made errors go away, but it's not set how I want it. Now it
    // just matches this example: https://stackoverflow.com/questions/39910017/angular-2-custom-validation-unit-testing
    // this also looked helpful maybe: https://stackoverflow.com/questions/52046741/angular-testbed-query-by-css-find-the-pseudo-element
    // and this: https://angular.io/guide/form-validation
    // and this: https://github.com/angular/angular/blob/7.2.2/packages/forms/src/validators.ts#L136-L157
    // maybe this?: https://angular.io/guide/testing#component-with-inputs-and-outputs
    it('should not allow a name to contain a symbol'), async(() => {
            let fixture = TestBed.createComponent(AddUserComponent);
            let comp = fixture.componentInstance;
            let debug = fixture.debugElement;
            let input = debug.query(By.css('[name=email]'));

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                input.nativeElement.value = 'bad@email.com';
                dispatchEvent(input.nativeElement);
                fixture.detectChanges();

                let form: NgForm = debug.children[0].injector.get(NgForm);
                let control = form.control.get('email');
                expect(control.hasError('notPeeskillet')).toBe(true);
                expect(form.control.valid).toEqual(false);
                expect(form.control.hasError('notPeeskillet', ['email'])).toEqual(true);

                input.nativeElement.value = 'peeskillet@stackoverflow.com';
                dispatchEvent(input.nativeElement);
                fixture.detectChanges();

                expect(control.hasError('notPeeskillet')).toBe(false);
                expect(form.control.valid).toEqual(true);
                expect(form.control.hasError('notPeeskillet', ['email'])).toEqual(false);
            });
        });
});
