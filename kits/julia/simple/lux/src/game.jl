"""
    Game(messages::AbstractDict,
         configuration::GameConstants = JSON3.read(read(joinpath(pkgdir(LuxAI), "src", "lux", "game_constants.json"), String),
                                                   GameConstants))

Struct for the state of the game.
"""
struct Game
    id :: Int
    turn :: Ref{Int}
    map :: GameMap
    players :: NTuple{2, Player}
    configuration :: GameConstants
    function Game(observations::AbstractDict,
                  configuration::GameConstants = JSON3.read(read(joinpath(pkgdir(LuxAI), "src", "lux", "game_constants.json"), String), GameConstants))
        updates = observations["updates"]
        id = parse(Int, updates[1])
        turn = Ref(observations["step"])
        # get some other necessary initial input
        game_map = GameMap(parse(Int, match.(r"\d+", updates[2]).match))
        players = (Player(0), Player(1))
        new(id, turn, game_map, players, configuration)
    end
end
"""
    _end_turn(::Game) :: Nothing

Prints the signal for end of turn.
"""
_end_turn(::Game) = print("D_FINISH")
"""
    _reset_player_states!(obj::Game) :: Nothing

Resets the state of the players after finishing their turn.
"""
function _reset_player_states!(obj::Game)
    for player in obj.players
        empty!(player.units)
        empty!(player.cities)
    end
    nothing
end
"""
    _update!(obj::Game, messages)

Update state of the game.
"""
function _update!(obj::Game, observation::AbstractVector{<:AbstractString})
    for col in axes(obj.map.map, 2)
        for row in axes(obj.map.map, 1)
            obj.map.map[row, col] = Cell(Position(row - 1, col - 1))
        end
    end
    obj.turn.x += 1
    _reset_player_states!(obj)
    for update in observation
        if update == "D_DONE"
            break
        end
        observation = observation["updates"]
        update = observation[end - 8]
        strs = split(update, " ")
        input_identifier = strs[1]
        if input_identifier == obj.configuration.INPUTS.RESEARCH_POINTS
            team = parse(Int, strs[2])
            obj.players[team + 1].research_points = parse(Int, strs[3])
        elseif input_identifier == obj.configuration.INPUTS.RESOURCES
            type = strs[2]
            x = parse(Int, strs[3])
            y = parse(Int, strs[4])
            amt = parse(Float64, strs[5])
            pos = Position(x, y)
            resource = Resource(type, amt)
            obj.map.map[x + 1, y + 1] = Cell(pos, resource)
        elseif input_identifier == obj.configuration.INPUTS.UNITS
            unittype = parse(Int, strs[2])
            unittype = findfirst(isequal(unittype), values(obj.configuration.UNIT_TYPES))
            unittype = string(keys(obj.configuration.UNIT_TYPES)[unittype])
            team = parse(Int, strs[3])
            unitid = strs[4]
            x = parse(Int, strs[5])
            y = parse(Int, strs[6])
            pos = Position(x, y)
            cooldown = parse(Float64, strs[7])
            wood = parse(Int, strs[8])
            coal = parse(Int, strs[9])
            uranium = parse(Int, strs[10])
            cargo = Cargo(;wood, coal, uranium)
            push!(obj.players[team + 1].units, Unit(unitid, team, pos, unittype, cooldown, cargo))
        elseif input_identifier == obj.configuration.INPUTS.CITY
            team = parse(Int, strs[2])
            cityid = strs[3]
            fuel = parse(Float64, strs[4])
            lightupkeep = parse(Float64, strs[5])
            obj.players[team + 1].cities[cityid] = City(cityid, team, fuel, lightupkeep)
        elseif input_identifier == obj.configuration.INPUTS.CITY_TILES
            team = parse(Int, strs[2])
            cityid = strs[3]
            x = parse(Int, strs[4])
            y = parse(Int, strs[5])
            pos = Position(x, y)
            cooldown = parse(Float64, strs[6])
            city = obj.players[team + 1].cities[cityid]
            citytile = CityTile(cityid, team, pos, cooldown)
            push!(city.citytiles, citytile)
            cell = get_cell_by_pos(obj.map, pos)
            cell.citytile = citytile
            obj.players[team + 1].city_tile_count += 1
        elseif input_identifier == obj.configuration.INPUTS.ROADS
            x = parse(Int, strs[2])
            y = parse(Int, strs[3])
            pos = Position(x, y)
            road = parse(Float64, strs[4])
            cell = get_cell_by_pos(obj.map, pos)
            cell.road = road
        end
    end
end
