<?php

declare(strict_types=1);

namespace MauticPlugin\GrapesJsBuilderBundle\Helper;

use Mautic\CacheBundle\Cache\CacheProvider;
use Mautic\CoreBundle\Exception\FileUploadException;
use Mautic\CoreBundle\Helper\CoreParametersHelper;
use Mautic\CoreBundle\Helper\FileUploader;
use Mautic\CoreBundle\Helper\PathsHelper;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class FileManager
{
    const GRAPESJS_IMAGES_DIRECTORY = '';

    const CACHE_TTL = 86400; // 1 day

    /**
     * @var FileUploader
     */
    private $fileUploader;

    /**
     * @var CoreParametersHelper
     */
    private $coreParametersHelper;

    /**
     * @var PathsHelper
     */
    private $pathsHelper;

    /**
     * @var CacheProvider
     */
    private $cacheProvider;

    /**
     * FileManager constructor.
     */
    public function __construct(
        FileUploader $fileUploader,
        CoreParametersHelper $coreParametersHelper,
        PathsHelper $pathsHelper,
        CacheProvider $cacheProvider
    ) {
        $this->fileUploader         = $fileUploader;
        $this->coreParametersHelper = $coreParametersHelper;
        $this->pathsHelper          = $pathsHelper;
        $this->cacheProvider = $cacheProvider;
    }

    /**
     * @param $request
     *
     * @return array
     */
    public function uploadFiles($request)
    {
        if (isset($request->files->all()['files'])) {
            $files         = $request->files->all()['files'];
            $uploadDir     = $this->getUploadDir();
            $uploadedFiles = [];

            foreach ($files as $file) {
                try {
                    $uploadedFiles[] =  $this->getFullUrl($this->fileUploader->upload($uploadDir, $file));
                } catch (FileUploadException $e) {
                }
            }
        }

        $this->deleteCache($this->getCacheKey());

        return $uploadedFiles;
    }

    /**
     * @param string $fileName
     */
    public function deleteFile($fileName)
    {
        $this->fileUploader->delete($this->getCompleteFilePath($fileName));
        $this->deleteCache($this->getCacheKey());
    }

    /**
     * @param string $fileName
     *
     * @return string
     */
    public function getCompleteFilePath($fileName)
    {
        $uploadDir = $this->getUploadDir();

        return $uploadDir.$fileName;
    }

    /**
     * @return string
     */
    private function getUploadDir()
    {
        return $this->getGrapesJsImagesPath(true);
    }

    /**
     * @param $fileName
     *
     * @return string
     */
    public function getFullUrl($fileName, $separator = '/')
    {
        // if a static_url (CDN) is configured use that, otherwiese use the site url
        $url = $this->coreParametersHelper->getParameter('static_url') ?? $this->coreParametersHelper->getParameter('site_url');

        return $url
            .$separator
            .$this->getGrapesJsImagesPath(false, $separator)
            .$fileName;
    }

    /**
     * @param bool   $fullPath
     * @param string $separator
     *
     * @return string
     */
    private function getGrapesJsImagesPath($fullPath = false, $separator = '/')
    {
        return $this->pathsHelper->getSystemPath('images', $fullPath)
            .$separator
            .self::GRAPESJS_IMAGES_DIRECTORY;
    }

    /**
     * @return array
     */
    public function getImages()
    {
        $cacheAdapter = $this->cacheProvider->getCacheAdapter();

        $cacheItem = $cacheAdapter->getItem($this->getCacheKey());

        if ($cacheItem->isHit()) {
            return $cacheItem->get();
        }

        $files      = [];
        $uploadDir  = $this->getUploadDir();

        $fileSystem = new Filesystem();

        if (!$fileSystem->exists($uploadDir)) {
            try {
                $fileSystem->mkdir($uploadDir);
            } catch (IOException $exception) {
                return $files;
            }
        }

        $finder = new Finder();
        $finder->files()->in($uploadDir);

        foreach ($finder as $file) {
            // exclude certain folders from grapesjs file manager
            if (in_array($file->getRelativePath(), $this->coreParametersHelper->get('image_path_exclude'))) {
                continue;
            }

            if ($size = @getimagesize($this->getCompleteFilePath($file->getRelativePathname()))) {
                $files[] = [
                    'src'    => $this->getFullUrl($file->getRelativePathname()),
                    'width'  => $size[0],
                    'type'   => 'image',
                    'height' => $size[1],
                ];
            } else {
                $files[] = $this->getFullUrl($file->getRelativePathname());
            }
        }

        $cacheItem->expiresAfter(self::CACHE_TTL);
        $cacheItem->set($files);
        $cacheAdapter->save($cacheItem);

        return $files;
    }

    private function getCacheKey()
    {
        return 'grapesjs_' . md5($this->getUploadDir());
    }

    /**
     * @param string $key
     * @throws \Psr\Cache\InvalidArgumentException
     */
    private function deleteCache($key)
    {
        $cacheAdapter = $this->cacheProvider->getCacheAdapter();
        if ($cacheAdapter->hasItem($key)) {
            $cacheAdapter->deleteItem($key);
        }
    }
}
