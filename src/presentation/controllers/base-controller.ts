import { Request , Response } from  "express";
import { BaseService } from "../../application/services/base-service.js";

export abstract class BaseController<T, CreateDto, UpdateDto> {
    protected abstract readonly service: BaseService<T, CreateDto, UpdateDto>;

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Geçersiz ID formatı' });
                return;
            }
            
            const entity = await this.service.findById(id);
            if (!entity) {
                res.status(404).json({ message: `ID ${id} ile kayıt bulunamadı` });
                return;
            }
            
            res.status(200).json(entity);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
            res.status(500).json({ error: message });
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const entities = await this.service.findAll();
            res.status(200).json(entities);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
            res.status(500).json({ error: message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Geçersiz ID formatı' });
                return;
            }
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
            res.status(500).json({ error: message });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dto = req.body as CreateDto;
            const created = await this.service.create(dto);
            res.status(201).json(created);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Oluşturma başarısız';
            res.status(400).json({ error: message });
        }
    }
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Geçersiz ID formatı' });
                return;
            }

            const dto = req.body as UpdateDto;
            const updated = await this.service.update(id, dto);
            if (!updated) {
                res.status(404).json({ message: `ID ${id} ile kayıt bulunamadı` });
                return;
            }
            res.status(200).json(updated);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Güncelleme başarısız';
            res.status(400).json({ error: message });
        }
    }
};
