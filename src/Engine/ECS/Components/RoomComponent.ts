import { Component } from "./Component.js";

export default class RoomComponent extends Component {
	roomId: number;
	//if active player is in room.
	//if set to inactive, also ina
	active: boolean;

	hasBeenRevealed: boolean;
	//what monsters should be created when this room is revealed
	monsters: [{ type; position }];

	//powerups of type 'type' should be created here

	//transform area of type 'type' should be created here
}

/*
    Room entity behöver komponenter:
        position
        room

    rummet måste finns någonstans i världen ( bestämt av Gustavs maze, satt av position-component)
    rummet måste veta vilka monster som ska spawnas när player gått in i rummet
    playercomponent kanske behöver ett rum-id för vilken rum den är i, så man kan aktivera rätt rum
*/

/*
    Room system

    tar en playerkomponent och tittar vilket rum den är i
    om i detta rum, aktivera det och spawna alla entiteter specat av rummet om dom inte redan skapats
    om inte i detta rum, avaktivera det och gör vad med entiteterna i det?
    
*/

/*

|-----------------------|
|   O        |           |
|     .      |           |
|                     .  |
|  .         |           |
|       .    |           |
|-----------------------|


*/
