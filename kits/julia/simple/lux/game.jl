const INPUT_CONSTANTS = Dict("RESEARCH_POINTS" => "rp",
                             "RESOURCES" => "r",
                             "UNITS" => "u",
                             "CITY" => "c",
                             "CITY_TILES" => "ct",
                             "ROADS" => "ccd",
                             "DONE" => "D_DONE")
const DIRECTIONS_OUTPUT = Dict(north => "n",
                               west => "w",
                               south => "s",
                               east => "e",
                               center => "c")

mutable struct Game
    id :: Int
    turn :: Int
    map :: GameMap
    players :: NTuple{2, Player}
    function Game(messages::AbstractVector{<:AbstractString})
        id = parse(Int, messages[1])
        turn = -1
        # get some other necessary initial input
        mapinfo = split(messages[2], " ")
        dim = parse(Int, mapinfo[1])
        game_map = GameMap(dim)
        players = (Player(0), Player(1))
        new(id, turn, game_map, players)
    end
end

_end_turn(::Game) = print("D_FINISH")

function _reset_player_states!(obj::Game)
    for player in obj.players
        empty!(player.units)
        empty!(player.cities)
    end
    nothing
end

"""
    _update!(obj::Game, messages)

Update state.
"""
function _update!(obj::Game, messages::AbstractVector{<:AbstractString})
    obj.map .= GameMap(size(obj.map, 1))
    obj.turn += 1
    _reset_player_states!(obj)
    for update in messages
        if update == "D_DONE"
            break
        end
        strs = split(update, " ")
        input_identifier = strs[1]
        if input_identifier == INPUT_CONSTANTS["RESEARCH_POINTS"]
            team = parse(Int, strs[2])
            obj.players[team + 1].research_points = parse(Int, strs[3])
        elseif input_identifier == INPUT_CONSTANTS["RESOURCES"]
            r_type = strs[2]
            x = parse(Int, strs[3])
            y = parse(Int, strs[4])
            amt = parse(Float64, strs[5])
            pos = Position(x, y)
            resource = Resource(r_type, amt)
            obj.map[x + 1, y + 1] = Cell(pos, resource)
        elseif input_identifier == INPUT_CONSTANTS["UNITS"]
            unittype = parse(Int, strs[2])
            team = parse(Int, strs[3])
            unitid = strs[4]
            x = parse(Int, strs[5])
            y = parse(Int, strs[6])
            pos = Position(x, y)
            cooldown = parse(Float64, strs[7])
            wood = parse(Int, strs[8])
            coal = parse(Int, strs[9])
            uranium = parse(Int, strs[10])
            cargo = Cargo(wood, coal, uranium)
            append!(obj.players[team + 1].units, Unit(team, unittype, unitid, pos, cooldown, cargo))
        elseif input_identifier == INPUT_CONSTANTS["CITY"]
            team = parse(Int, strs[2])
            cityid = strs[3]
            fuel = parse(Float64, strs[4])
            lightupkeep = parse(Float64, strs[5])
            obj.players[team + 1].cities[cityid] = City(team, cityid, fuel, lightupkeep)
        elseif input_identifier == INPUT_CONSTANTS["CITY_TILES"]
            team = parse(Int, strs[2])
            cityid = strs[3]
            x = parse(Int, strs[4])
            y = parse(Int, strs[5])
            pos = Position(x, y)
            cooldown = parse(Float64, strs[6])
            city = obj.players[team + 1].cities[cityid]
            citytile = CityTile(cityid, team, pos, cooldown)
            append!(city.citytiles, citytile)
            cell = get_cell(obj.map, pos)
            cell.citytile = citytile
            obj.players[team + 1].city_tile_count += 1
        elseif input_identifier == INPUT_CONSTANTS["ROADS"]
            x = parse(Int, strs[2])
            y = parse(Int, strs[3])
            pos = Position(x, y)
            road = parse(Float64, strs[4])
            cell = get_cell(obj.map, pos)
            cell.road = road
        end
    end
end
