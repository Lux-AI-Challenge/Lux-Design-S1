include(joinpath("kits", "julia", "simple", "lux", "annotate.jl"))
include(joinpath("kits", "julia", "simple", "lux", "constants.jl"))
include(joinpath("kits", "julia", "simple", "lux", "game_objects.jl"))
include(joinpath("kits", "julia", "simple", "lux", "game.jl"))

"""
    Agent(observation, configuration) :: Vector{String}
"""
struct Agent(observation, configuration)
    ### Do not edit ###
    if observation["step"] == 0
        game_state = Game(observation["updates"][1:2])
        _update!(game_state, messages["updates"][3:end])
        game_state.id = observation.player
    else
        _update!(game_state, observation["updates"])
    end
    actions = String[]

    player = game_state.players[observation.player]
    opponent = game_state.players[(observation.player + 1) % 2]
    width, height = size(game_state.map)

    resource_tiles = Cell[]
    for y in width
        for x in height
            cell = get_cell(game_state.map, Position(x, y))
            if has_resource(cell)
                push!(resource_tiles, cell)
            end
        end
    end

    # we iterate over all our units and do something with them
    for unit in player.units
        if unit.unit_type == worker && can_act(unit)
            closest_dist = Inf
            closest_resource_tile = nothing
            if get_cargo_space_left(unit) > 0
                # if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
                for resource_tile in resource_tiles
                    resource_tile.resource.r_type == coal && !researched_coal(player) && continue
                    resource_tile.resource.r_type == uranium && !researched_uranium(player) && continue
                    dist = distance_to(resource_tile.pos, unit.pos)
                    if dist < closest_dist
                        closest_dist = dist
                        closest_resource_tile = resource_tile
                    end
                end
                if !ismissing(closest_resource_tile)
                    append!(actions, move(unit, direction_to(unit.pos, closest_resource_tile.pos)))
                end
            else
                # if unit is a worker and there is no cargo space left, and we have cities, lets return to them
                if length(player.cities) > 0
                    closest_dist = Inf
                    closest_city_tile = nothing
                    for city in values(player.cities)
                        for city_tile in city.citytiles
                            dist = distance_to(city_tile.pos, unit.pos)
                            if dist < closest_dist
                                closest_dist = dist
                                closest_city_tile = city_tile
                            end
                        end
                    end
                    if !isnothing(closest_city_tile)
                        move_dir = direction_to(unit.pos, closest_city_tile.pos)
                        append!(actions, move(unit, move_dir))
                    end
                end
            end
        end
    end

    # you can add debug annotations using the functions in the annotate object
    # append!(actions, circle(0, 0))
    actions
end
