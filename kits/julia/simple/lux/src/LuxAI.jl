module LuxAI

using JSON3: JSON3, StructType, Struct

for file in ["annotate", "constants", "game_objects", "game"]
    include(joinpath("lux", "$file.jl"))
end

# function julia_main()::Cint
#     # do something based on ARGS?
#     return 0 # if things finished successfully
# end

end
