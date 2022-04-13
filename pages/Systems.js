import Matter from "matter-js";
import { Dimensions } from "react-native";
import { Trash } from "./Trash";

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
        engine.world.gravity.y = 1.5;
        entities.trashCan.type = "can";
        dispatch('next_level');
    }
    else if(level == 2 && score == 20)
    {
        entities.floor.level = 3;
        engine.world.gravity.y = 2;
        entities.trashCan.type = "paper";
        dispatch('next_level');
    }
    else if(level == 3 && score == 36)
    {
        entities.floor.level = 4;
        engine.world.gravity.y = 3;
        entities.trashCan.type = "paper";
        dispatch('next_level');
    }
    else if(level == 4 && score == 55)
    {
        entities.floor.level = 5;
        engine.world.gravity.y = 5;
        entities.trashCan.type = "plastic";
        dispatch('next_level');
    }

    if(life == 0)
    {
        entities.floor.score = 0;
        entities.floor.level = 1;
        entities.floor.life = 3;
        engine.world.gravity.y = 1;
        entities.trashCan.type = 'can';
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
        dispatch("game-over")
    }

    return entities;
}

const MoveTrashCan = (entities, { touches }) => {

    let t = touches.find(x => x.type === "move");
    let trashCan = entities.trashCan;
    const x = trashCan.body.position.x;
    const y = trashCan.body.position.y;
    if(t && trashCan)
    {
        Matter.Body.set(trashCan.body, "position", {x: x + t.delta.pageX, y: y});
    }

    return entities;
}

const deleteTrash = (entities, { time, dispatch }) => {
    if(entities.trash)
    {
        const trash = entities.trash.body;
        const trashID = trash.id;
        const trashCan = entities.trashCan.body;
        const trashCanID = trashCan.id;
        const floor = entities.floor.body;
        const floorID = floor.id;
        let engine = entities["physics"].engine;
        let world = entities["physics"].world;
        Matter.Events.on(engine, 'collisionStart', (event) => {
            if(event.pairs[0].bodyA.id == trashID || event.pairs[0].bodyB.id == trashID)
            {
                if(event.pairs[0].bodyA.id == trashCanID || event.pairs[0].bodyB.id == trashCanID )
                {
                    if(entities.trash)
                    {
                        entities.floor.score = entities.floor.score + 1;
                        dispatch('update_score');
                    }
                    Matter.Composite.remove(world, trash);
                    delete entities.trash
                }
            }
            if(event.pairs[0].bodyA.id == trashID || event.pairs[0].bodyB.id == trashID)
            {
                if(event.pairs[0].bodyA.id == floorID || event.pairs[0].bodyB.id == floorID )
                {
                    if(entities.trash)
                    {
                        entities.floor.life = entities.floor.life - 1;
                    }
                    Matter.Composite.remove(world, trash);
                    delete entities.trash
                }
            }
        });
    }
    else
    {
        
            const {width, height} = Dimensions.get("screen");

            const boxSize = Math.trunc(Math.max(width, height) * 0.035);
    
            const randomPosition = Math.floor(Math.random() * (width - 10 - 10)) + 10;
    
            const trash = Matter.Bodies.rectangle(randomPosition, 0, boxSize, boxSize);
    
            let world = entities["physics"].world;

            let type = Math.floor(Math.random() * 3);
    
            Matter.World.add(world, [trash]);
            entities['trash'] = {
                body: trash,
                size: [boxSize, boxSize],
                trash: entities.trashCan.type,
                type: type,
                renderer: Trash
            }

    }
   
    return entities;
}

export { Physics, MoveTrashCan, deleteTrash };