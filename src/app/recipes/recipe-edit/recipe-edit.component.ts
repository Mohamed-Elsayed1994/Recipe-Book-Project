import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit {
  id:number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, 
    private recipeService: RecipeService,
    private router: Router){

  }

  onCancle(){
    this.router.navigate(['../'], {relativeTo: this.route});

  }

  onSubmit(){
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']

    );
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, newRecipe);
    }else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.router.navigate(['../'], {relativeTo: this.route});

  }

  ngOnInit(){
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

   initForm(){
    let recipeName = '';
    let imagePath = '';
    let description = '' ;
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
      const recipe= this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      imagePath = recipe.imagePath;
      description = recipe.description;

      if(recipe['ingredients']){
        for(let ingredient of recipe.ingredients)
        recipeIngredients.push(
      new FormGroup({
        'name' : new FormControl(ingredient.name,Validators.required),
        'amount' : new FormControl(ingredient.amount,
          [Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)])
      }))
      }
    }

    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName,Validators.required),
      'imagePath': new FormControl( imagePath ,Validators.required),
      'description' : new FormControl(description,Validators.required),
      'ingredients' : recipeIngredients
    })

}
get controls() {
  return (<FormArray>this.recipeForm.get('ingredients')).controls;
}

onAddIngredient(){
  (<FormArray>this.recipeForm.get('ingredients')).push(
    new FormGroup({
      'name': new FormControl(null,Validators.required),
      'amount': new FormControl( null, [Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)])
    })
  )

}
onDeleteIngredient(index: number){
  (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);

}
}
