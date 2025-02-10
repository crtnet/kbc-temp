// backend/src/controllers/bookController.ts
import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import Book from '../models/Book';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Verifica se a chave da API está configurada
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY não está configurada!');
  process.exit(1);
}

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// Função para criar livro
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, genre, theme, mainCharacter, setting, tone } = req.body;
    const userId = req.user.id;

    console.log('Criando livro:', {
      title,
      genre,
      theme,
      mainCharacter,
      setting,
      tone,
      userId
    });

    const book = new Book({
      title,
      author: userId,
      genre,
      theme,
      mainCharacter,
      setting,
      tone,
      status: 'generating'
    });

    await book.save();
    console.log('Livro criado:', book._id);

    // Iniciar geração em background
    generateBookContent(book._id).catch(err => {
      console.error('Erro na geração em background:', err);
    });

    res.status(201).json({
      message: 'Livro criado com sucesso! O conteúdo está sendo gerado.',
      bookId: book._id
    });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({ message: 'Erro ao criar livro' });
  }
};

// Função para buscar um livro específico
export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    if (book.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    res.json(book);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({ message: 'Erro ao buscar livro' });
  }
};

// Função para listar livros do usuário
export const getUserBooks = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const books = await Book.find({ author: userId })
      .sort({ createdAt: -1 })
      .select('-content.story');
    
    res.json(books);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({ message: 'Erro ao buscar livros' });
  }
};

// Função para gerar conteúdo do livro
async function generateBookContent(bookId: string) {
  try {
    console.log('Iniciando geração de conteúdo para o livro:', bookId);
    
    const book = await Book.findById(bookId);
    if (!book) {
      console.error('Livro não encontrado:', bookId);
      return;
    }

    console.log('Verificando configuração da OpenAI...');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não está configurada');
    }

    // Gerar história
    const storyPrompt = `
      Crie uma história infantil em português com as seguintes características:
      - Título: ${book.title}
      - Gênero: ${book.genre}
      - Tema: ${book.theme}
      - Personagem Principal: ${book.mainCharacter}
      - Cenário: ${book.setting}
      - Tom: ${book.tone}
      
      A história deve:
      - Ter aproximadamente 500 palavras
      - Ser dividida em 5 páginas
      - Cada página deve ter um parágrafo curto
      - Ser adequada para crianças
      - Ter uma moral relacionada ao tema
      - Ser envolvente e criativa
      - Incluir diálogos
      - Ter um final feliz
    `;

    console.log('Gerando história...');
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: storyPrompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const story = completion.data.choices[0].text?.trim() || '';
    const pages = story.split('\n\n').filter(Boolean).map(text => ({ text, imageUrl: '' }));

    // Gerar imagens
    console.log('Gerando imagens...');
    for (let i = 0; i < pages.length; i++) {
      const imagePrompt = `
        Crie uma ilustração infantil colorida para a seguinte cena:
        "${pages[i].text}"
        
        Estilo:
        - Ilustração infantil colorida
        - Estilo amigável e acolhedor
        - Cores vibrantes
        - Personagens expressivos
        - Adequado para crianças
      `;

      const imageResponse = await openai.createImage({
        prompt: imagePrompt,
        n: 1,
        size: "512x512",
      });

      pages[i].imageUrl = imageResponse.data.data[0].url || '';
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Atualizar livro
    book.content = { story, pages };
    book.status = 'completed';
    await book.save();

    console.log('Livro gerado com sucesso:', bookId);
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error);
    
    const book = await Book.findById(bookId);
    if (book) {
      book.status = 'failed';
      await book.save();
    }
  }
}