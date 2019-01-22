import { FormControl } from '@angular/forms';

export class NameValidator {

    // Folks: this example is just here to show that you CAN provide a meaningful validator
    // of your own. So, if you want to look into that, this is kind of how to do it, but this should
    // not be considered a stellar example that is totally complete and working as it should.
    static validName(fc: FormControl){
        if(fc.value.toLowerCase() === "abc123" || fc.value.toLowerCase() === "123abc"){
            return {
                validName: true
            };
        } else {
            return null;
        }
    }
}
