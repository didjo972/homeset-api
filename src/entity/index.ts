import {CookingReceip} from './cookingbook/CookingReceip';
import {Element} from './cookingbook/Element';
import {Ingredient} from './cookingbook/Ingredient';
import {Act} from './garage/Act';
import {Servicing} from './garage/Servicing';
import {Vehicle} from './garage/Vehicle';
import {Item} from './saveobject/Item';
import {Place} from './saveobject/Place';
import {Task} from './todolist/Task';
import {Todo} from './todolist/Todo';
import {User} from './User';

export const entities = [
    User,
    Todo,
    Task,
    Item,
    Place,
    CookingReceip,
    Element,
    Ingredient,
    Act,
    Servicing,
    Vehicle,
];
