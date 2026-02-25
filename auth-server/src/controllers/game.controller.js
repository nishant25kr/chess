import prisma from "../db/prismaClient.js";

export const createGame = async (req, res) => {
    try {
        const {id, whitePlayerId, blackPlayerId } = req.body;

        if (!whitePlayerId || !blackPlayerId) {
            return res.status(400).json({
                message: "whitePlayerId and blackPlayerId are required"
            });
        }

        if (whitePlayerId === blackPlayerId) {
            return res.status(400).json({
                message: "A user cannot play against themselves"
            });
        }

        const [whiteUser, blackUser] = await Promise.all([
            prisma.user.findUnique({ where: { id: whitePlayerId } }),
            prisma.user.findUnique({ where: { id: blackPlayerId } })
        ]);

        if (!whiteUser || !blackUser) {
            return res.status(404).json({
                message: "One or both users not found"
            });
        }

        const game = await prisma.game.create({
            data: {
                id,
                whitePlayerId,
                blackPlayerId
            },
            include: {
                whitePlayer: { select: { id: true, name: true } },
                blackPlayer: { select: { id: true, name: true } }
            }
        });

        return res.status(201).json({
            message: "Game created successfully",
            game
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const moves = async (req, res) => {
    try {
        const { gameId, from, to } = req.body;

        if (!gameId) {
            return res.status(400).json({
                message: "gameId is required"
            });
        }

        const game = await prisma.game.findUnique({
            where: { id: gameId }
        });

        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }
        const moves = await prisma.move.create({
            data: {
                gameId,
                from,
                to
            }
        });

        return res.status(200).json({
            message: "Move recorded successfully",
            move: moves
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
