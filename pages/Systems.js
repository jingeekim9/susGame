import Matter from "matter-js";
import { Dimensions } from "react-native";
import { Trash } from "./Trash";
import { TrashCan } from "./TrashCan";

var curMoving = "";

const distance = ([x1, y1], [x2, y2]) => {
    // return Math.sqrt(Math.abs(Math.pow(x2 - x1, 2)+ Math.pow(y2 - y1, 2)))
    return Math.abs(x1 - x2)
}

const Physics = (entities, { time, dispatch }) => {
    let engine = entities["physics"].engine;
    let world = entities["physics"].world;

    Matter.Engine.update(engine, time.delta);

    let score = entities.floor.score;
    let level = entities.floor.level;
    let life = entities.floor.life;

    if(level == 1 && score == 10)
    {
        entities.floor.level = 2;
        engine.world.gravity.y = 0.5;
        dispatch('next_level');
    }
    else if(level == 2 && score == 20)
    {
        entities.floor.level = 3;
        engine.world.gravity.y = 0.6;
        dispatch('next_level');
    }
    else if(level == 3 && score == 36)
    {
        entities.floor.level = 4;
        engine.world.gravity.y = 0.8;
        dispatch('next_level');
    }
    else if(level == 4 && score == 55)
    {
        entities.floor.level = 5;
        engine.world.gravity.y = 0.1;
        dispatch('next_level');

        if(!entities.plasticTrashCan)
        {
            const {width, height} = Dimensions.get("screen");

            const plasticTrashCan = Matter.Bodies.rectangle(width / 2, height / 2 + 200, 50, 25, {isStatic: true});

            Matter.World.add(world, [plasticTrashCan]);
                entities['plasticTrashCan'] = {
                    body: plasticTrashCan,
                    size: [50, 25],
                    type: 'plastic',
                    renderer: TrashCan
                }
        }
    }

    if(life == 0)
    {
        entities.floor.score = 0;
        entities.floor.level = 1;
        entities.floor.life = 3;
        engine.world.gravity.y = 0.5;
        if(entities.trash)
        {
            Matter.Composite.remove(world, entities.trash.body);
            delete entities.trash;
        }
        if(entities.trash1)
        {
            Matter.Composite.remove(world, entities.trash1.body);
            delete entities.trash1;
        }
        if(entities.trash2)
        {
            Matter.Composite.remove(world, entities.trash2.body);
            delete entities.trash2;
        }
        if(entities.trash3)
        {
            Matter.Composite.remove(world, entities.trash3.body);
            delete entities.trash3;
        }
        if(entities.plasticTrashCan)
        {
            Matter.Composite.remove(world, entities.plasticTrashCan.body);
            delete entities.plasticTrashCan;
        }
        dispatch("game-over")
    }

    return entities;
}

const MoveTrashCan = (entities, { touches }) => {

    let canTrashCan = entities.canTrashCan;
    let paperTrashCan = entities.paperTrashCan;
    let plasticTrashCan = entities.plasticTrashCan;
    if(plasticTrashCan)
    {

        let start = touches.find(x => x.type == "start");
    
        let t = touches.find(x => x.type === "move");

        const canX = canTrashCan.body.position.x;
        const canY = canTrashCan.body.position.y;
        const paperX = paperTrashCan.body.position.x;
        const paperY = paperTrashCan.body.position.y;
        const plasticX = plasticTrashCan.body.position.x;
        const plasticY = plasticTrashCan.body.position.y;

        if(start)
        {
            let startX = start.event.pageX;
            let startY = start.event.pageY;
    
            let canDistance = distance([canX, canY], [startX, startY]);
            let paperDistance = distance([paperX, paperY], [startX, startY]);
            let plasticDistance = distance([plasticX, plasticY], [startX, startY]);
    
            if(canDistance < paperDistance && canDistance < plasticDistance)
            {
                curMoving = "can";
            }
            else if(paperDistance < canDistance && paperDistance < plasticDistance)
            {
                curMoving = "paper";
            }
            else if(plasticDistance < canDistance && plasticDistance < paperDistance)
            {
                curMoving = "plastic";
            }
        }
        if(t && canTrashCan && paperTrashCan && plasticTrashCan)
        {        
            
            if(curMoving == "can")
            {
                Matter.Body.set(canTrashCan.body, "position", {x: canX + t.delta.pageX, y: canY});
            }
            else if(curMoving == "paper")
            {
                Matter.Body.set(paperTrashCan.body, "position", {x: paperX + t.delta.pageX, y: paperY});
            }
            else if(curMoving == "plastic")
            {
                Matter.Body.set(plasticTrashCan.body, "position", {x: plasticX + t.delta.pageX, y: plasticY});
            }
        }
    }
    else
    {

        let start = touches.find(x => x.type == "start");
    
        let t = touches.find(x => x.type === "move");

        const canX = canTrashCan.body.position.x;
        const canY = canTrashCan.body.position.y;
        const paperX = paperTrashCan.body.position.x;
        const paperY = paperTrashCan.body.position.y;

        if(start)
        {
            let startX = start.event.pageX;
            let startY = start.event.pageY;
    
            let canDistance = distance([canX, canY], [startX, startY]);
            let paperDistance = distance([paperX, paperY], [startX, startY]);
    
            if(canDistance < paperDistance)
            {
                curMoving = "can";
            }
            else
            {
                curMoving = "paper";
            }
        }
        if(t && canTrashCan && paperTrashCan)
        {        
            
            if(curMoving == "can")
            {
                Matter.Body.set(canTrashCan.body, "position", {x: canX + t.delta.pageX, y: canY});
            }
            else if(curMoving == "paper")
            {
                Matter.Body.set(paperTrashCan.body, "position", {x: paperX + t.delta.pageX, y: paperY});
            }
        }
    }

    return entities;
}

const deleteTrash = (entities, { time, dispatch }) => {
    if(entities.trash)
    {
        const trash = entities.trash.body;
        const trashID = trash.id;
        const canTrashCan = entities.canTrashCan.body;
        const canTrashCanID = canTrashCan.id;
        const paperTrashCan = entities.paperTrashCan.body;
        const paperTrashCanID = paperTrashCan.id;
        const plasticTrashCan = entities.plasticTrashCan ? entities.plasticTrashCan.body : null;
        const plasticTrashCanID = plasticTrashCan ? plasticTrashCan.id : null;
        const floor = entities.floor.body;
        const floorID = floor.id;
        let engine = entities["physics"].engine;
        let world = entities["physics"].world;
        Matter.Events.on(engine, 'collisionStart', (event) => {
            if(event.pairs[0].bodyA.id == trashID || event.pairs[0].bodyB.id == trashID)
            {
                if(event.pairs[0].bodyA.id == canTrashCanID || event.pairs[0].bodyB.id == canTrashCanID )
                {
                    if(entities.trash)
                    {
                        if(entities.trash.trash == 'can')
                        {
                            entities.floor.score = entities.floor.score + 1;
                            dispatch('update_score');
                        }
                        else
                        {
                            entities.floor.life = entities.floor.life - 1;
                            dispatch('lose_life');
                        }
                        
                        Matter.Composite.remove(world, trash);
                        delete entities.trash
                    }
                }

                if(event.pairs[0].bodyA.id == paperTrashCanID || event.pairs[0].bodyB.id == paperTrashCanID )
                {
                    if(entities.trash)
                    {
                        if(entities.trash.trash == 'paper')
                        {
                            entities.floor.score = entities.floor.score + 1;
                            dispatch('update_score');
                        }
                        else
                        {
                            entities.floor.life = entities.floor.life - 1;
                            dispatch('lose_life');
                        }
                        
                        Matter.Composite.remove(world, trash);
                        delete entities.trash
                    }
                }

                if(plasticTrashCanID)
                {
                    if(event.pairs[0].bodyA.id == plasticTrashCanID || event.pairs[0].bodyB.id == plasticTrashCanID )
                    {
                        if(entities.trash)
                        {
                            if(entities.trash.trash == 'plastic')
                            {
                                entities.floor.score = entities.floor.score + 1;
                                dispatch('update_score');
                            }
                            else
                            {
                                entities.floor.life = entities.floor.life - 1;
                                dispatch('lose_life');
                            }
                            
                            Matter.Composite.remove(world, trash);
                            delete entities.trash
                        }
                    }
                }

            }
            if(event.pairs[0].bodyA.id == trashID || event.pairs[0].bodyB.id == trashID)
            {
                if(event.pairs[0].bodyA.id == floorID || event.pairs[0].bodyB.id == floorID )
                {
                    if(entities.trash)
                    {
                        entities.floor.life = entities.floor.life - 1;
                        dispatch('lose_life');
                        
                        Matter.Composite.remove(world, trash);
                        delete entities.trash
                    }
                }
            }
        });
    }
    else
    {
        let level = entities.floor.level;

        const {width, height} = Dimensions.get("screen");

        const boxSize = Math.trunc(Math.max(width, height) * 0.035);

        const randomPosition = Math.floor(Math.random() * (width - 10 - 10)) + 10;

        const trash = Matter.Bodies.rectangle(randomPosition, -50, boxSize*1.5, boxSize*1.5);

        let world = entities["physics"].world;

        if(level == 1)
        {
            let trashType = Math.round(Math.random());

            let type = Math.round(Math.random() * 0);
            
            if(trashType == 0)
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'can',
                    type: type,
                    renderer: Trash
                }
            }
            else
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'paper',
                    type: type,
                    renderer: Trash
                }
            }
        }
        else if(level == 2)
        {
            let trashType = Math.round(Math.random());

            let type = Math.round(Math.random() * 1);
            
            if(trashType == 0)
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'can',
                    type: type,
                    renderer: Trash
                }
            }
            else
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'paper',
                    type: type,
                    renderer: Trash
                }
            }
        }
        else if(level == 3 || level == 4)
        {
            let trashType = Math.round(Math.random());

            let type = Math.round(Math.random() * 2);
            
            if(trashType == 0)
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'can',
                    type: type,
                    renderer: Trash
                }
            }
            else
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'paper',
                    type: type,
                    renderer: Trash
                }
            }
        }
        else if(level == 5)
        {
            let trashType = Math.round(Math.random() * 2);

            let type = Math.round(Math.random() * 2);
            
            if(trashType == 0)
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'can',
                    type: type,
                    renderer: Trash
                }
            }
            else if(trashType == 1)
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'paper',
                    type: type,
                    renderer: Trash
                }
            }
            else if(trashType == 2)
            {
                Matter.World.add(world, [trash]);
                entities['trash'] = {
                    body: trash,
                    size: [boxSize*1.5, boxSize*1.5],
                    trash: 'plastic',
                    type: type,
                    renderer: Trash
                }
            }
        }
    }
   
    return entities;
}

export { Physics, MoveTrashCan, deleteTrash };